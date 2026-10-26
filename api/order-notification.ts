export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expectedSecret = process.env.ORDER_SECRET;
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!expectedSecret || !scriptUrl) {
    return res.status(500).json({ error: "Server configuration missing" });
  }



  const { name, phone, fulfilment, address, items, total, note } =
    req.body || {};

  if (
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof fulfilment !== "string" ||
    typeof items !== "string" ||
    typeof total !== "string"
  ) {
    return res.status(400).json({ error: "Invalid order details" });
  }

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: expectedSecret,
        name: name.slice(0, 120),
        phone: phone.slice(0, 40),
        fulfilment: fulfilment.slice(0, 80),
        address: typeof address === "string" ? address.slice(0, 500) : "",
        items: items.slice(0, 2000),
        total: total.slice(0, 80),
        note: typeof note === "string" ? note.slice(0, 500) : "",
      }),
      redirect: "follow",
    });

    if (!response.ok) {
      return res.status(502).json({ error: "Email service unavailable" });
    }

    const result = await response.json();

    if (!result.success) {
      return res.status(502).json({ error: "Order notification failed" });
    }

    return res.status(200).json({ success: true });
  } catch {
    return res.status(502).json({ error: "Could not send order notification" });
  }
      }
