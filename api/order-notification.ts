
export default async function handler(req: any, res: any) {
  return res.status(410).json({
    error: "This endpoint is disabled. Orders must go through Paystack payment verification."
  });
}
