
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const orderSecret = process.env.ORDER_SECRET;

  if (!secretKey || !scriptUrl || !orderSecret) {
    return res.status(500).json({
      error: "Payment verification configuration missing"
    });
  }

  const { reference } = req.body || {};

  if (
    typeof reference !== "string" ||
    !/^20sm_[a-zA-Z0-9-]{20,60}$/.test(reference)
  ) {
    return res.status(400).json({
      error: "Invalid payment reference"
    });
  }

  try {
    // Ask Paystack to verify the transaction.
    const paymentResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`
        }
      }
    );

    const paymentResult = await paymentResponse.json();
    const payment = paymentResult.data;

    if (
      !paymentResponse.ok ||
      !paymentResult.status ||
      !payment ||
      payment.status !== "success"
    ) {
      return res.status(400).json({
        success: false,
        error: "Payment has not been confirmed"
      });
    }

    // Confirm the reference and currency.
    if (
      payment.reference !== reference ||
      payment.currency !== "NGN"
    ) {
      return res.status(400).json({
        success: false,
        error: "Payment details do not match"
      });
    }

    // Retrieve the order attached during initialization.
    const order = payment.metadata?.order;

    if (
      !order ||
      typeof order.name !== "string" ||
      typeof order.phone !== "string" ||
      typeof order.email !== "string" ||
      !["Delivery", "Pickup"].includes(order.fulfilment) ||
      !Array.isArray(order.items) ||
      order.items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Order information is missing"
      });
    }

    const validIds = ["tee-1", "tee-2", "tee-3"];
    const validSizes = ["S", "M", "L", "XL", "XXL"];

    let quantityTotal = 0;
    const orderLines: string[] = [];

    for (const item of order.items) {
      if (
        !item ||
        !validIds.includes(item.productId) ||
        !validSizes.includes(item.size) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 10
      ) {
        return res.status(400).json({
          success: false,
          error: "Invalid order information"
        });
      }

      quantityTotal += item.quantity;

      orderLines.push(
        `${item.productId} — Size ${item.size} × ${item.quantity}`
      );
    }

    if (
      quantityTotal > 20 ||
      quantityTotal !== order.quantityTotal
    ) {
      return res.status(400).json({
        success: false,
        error: "Order quantity does not match"
      });
    }

    // Independently calculate the expected amount.
    const expectedAmount = quantityTotal * 25000 * 100;

    if (payment.amount !== expectedAmount) {
      return res.status(400).json({
        success: false,
        error: "Payment amount does not match the order"
      });
    }

    const totalText = `₦${(expectedAmount / 100).toLocaleString(
      "en-NG",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )}`;

    // Send the verified order to Google Apps Script.
    const notificationResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        secret: orderSecret,
        reference,
        name: order.name,
        email: order.email,
        phone: order.phone,
        fulfilment: order.fulfilment,
        address: order.address || "",
        items: orderLines.join("\n"),
        total: totalText,
        note: order.note || ""
      }),
      redirect: "follow"
    });

    if (!notificationResponse.ok) {
      return res.status(502).json({
        success: false,
        error: "Payment confirmed, but order notification failed"
      });
    }

    const notificationResult = await notificationResponse.json();

    if (!notificationResult.success) {
      return res.status(502).json({
        success: false,
        error: "Payment confirmed, but order notification failed"
      });
    }

    return res.status(200).json({
      success: true,
      reference,
      amount: expectedAmount,
      currency: "NGN",
      message: "Payment verified successfully"
    });

  } catch {
    return res.status(502).json({
      success: false,
      error: "Could not verify payment"
    });
  }
  }
      
