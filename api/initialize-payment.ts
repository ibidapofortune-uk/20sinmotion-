
import { randomUUID } from "crypto";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const appUrl = process.env.APP_URL;
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!secretKey || !appUrl || !scriptUrl) {
    return res.status(500).json({
      error: "Payment configuration missing"
    });
  }

  const {
    email,
    name,
    phone,
    fulfilment,
    address,
    note,
    items
  } = req.body || {};

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof phone !== "string" ||
    !phone.trim() ||
    !["Delivery", "Pickup"].includes(fulfilment) ||
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 20
  ) {
    return res.status(400).json({
      error: "Invalid order details"
    });
  }

  if (
    fulfilment === "Delivery" &&
    (typeof address !== "string" || !address.trim())
  ) {
    return res.status(400).json({
      error: "Delivery address is required"
    });
  }

  const validIds = new Set(["tee-1", "tee-2", "tee-3"]);
  const validSizes = ["S", "M", "L", "XL", "XXL"];

  let quantityTotal = 0;

  for (const item of items) {
    if (
      !item ||
      !validIds.has(item.productId) ||
      !validSizes.includes(item.size) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 10
    ) {
      return res.status(400).json({
        error: "Invalid cart item"
      });
    }

    quantityTotal += item.quantity;
  }

  if (quantityTotal > 20) {
    return res.status(400).json({
      error: "Order quantity is too large"
    });
  }

  // Calculate the amount on the server.
  const amount = quantityTotal * 25000 * 100;

  // Generate a unique transaction reference.
  const reference = `20sm_${randomUUID()}`;

  const order = {
    name: name.trim().slice(0, 120),
    phone: phone.trim().slice(0, 40),
    email: email.trim().toLowerCase(),
    fulfilment,
    address:
      fulfilment === "Delivery"
        ? address.trim().slice(0, 500)
        : "",
    note:
      typeof note === "string"
        ? note.trim().slice(0, 500)
        : "",
    items: items.map((item: any) => ({
      productId: item.productId,
      size: item.size,
      quantity: item.quantity
    })),
    quantityTotal
  };

  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: order.email,
          amount,
          currency: "NGN",
          reference,
          callback_url:
            `${appUrl.replace(/\/+$/, "")}/payment-return`,
          metadata: {
            order
          }
        })
      }
    );

    const result = await response.json();

    if (
      !response.ok ||
      !result.status ||
      !result.data?.authorization_url ||
      !result.data?.reference
    ) {
      return res.status(502).json({
        error: "Could not initialize payment"
      });
    }

    return res.status(200).json({
      authorizationUrl: result.data.authorization_url,
      reference: result.data.reference
    });

  } catch {
    return res.status(502).json({
      error: "Payment service unavailable"
    });
  }
          }
