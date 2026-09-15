import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      product_id,
      customer_email,
      amount,
      payment_rail, // 'busha' or 'solana_direct'
      tx_signature,
      referral_channel,
    } = body;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          product_id,
          customer_email: customer_email || "guest@arovaq.com",
          amount,
          payment_rail,
          payment_status: payment_rail === "solana_direct" ? "completed" : "pending",
          tx_signature,
          referral_channel,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, order: data });
  } catch (err: any) {
    console.error("Order logging error:", err);
    return NextResponse.json({ error: err.message || "Failed to log order" }, { status: 500 });
  }
}