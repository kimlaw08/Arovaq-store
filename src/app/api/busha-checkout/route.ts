import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // TODO: Connect Busha API request using process.env.BUSHA_API_KEY
    return NextResponse.json({
      checkoutUrl: "https://pay.busha.co/checkout/stub",
      orderId: body.orderId,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to initialize checkout" }, { status: 500 });
  }
}