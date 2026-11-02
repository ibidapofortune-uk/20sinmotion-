
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({ error: "Payment configuration missing" });
  }

  const { email, items } = req.body || {};

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 20
  ) {
    return res.status(400).json({ error: "Invalid order details" });
  }

  const validIds = new Set(["tee-1", "tee-2", "tee-3"]);
  let quantityTotal = 0;

  for (const item of items) {
    if (
      !item ||
      !validIds.has(item.productId) ||
      !["S", "M", "L", "XL", "XXL"].includes(item.size) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 10
    ) {
      return res.status(400).json({ error: "Invalid cart item" });
    }

    quantityTotal += item.quantity;
  }

  if (quantityTotal > 20) {
    return res.status(400).json({ error: "Order quantity is too large" });
  }

  const amount = quantityTotal * 25000 * 100;

  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          amount,
          currency: "NGN",
          callback_url: `${process.env.APP_URL}/payment-return`,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok || !result.status || !result.data?.authorization_url) {
      return res.status(502).json({ error: "Could not initialize payment" });
    }

    return res.status(200).json({
      authorizationUrl: result.data.authorization_url,
      reference: result.data.reference,
    });
  } catch {
    return res.status(502).json({ error: "Payment service unavailable" });
  }
}

