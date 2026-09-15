import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");
    const txSignature = searchParams.get("tx_signature");

    if (!orderId && !txSignature) {
      return NextResponse.json({ error: "Missing verification parameters (order_id or tx_signature)." }, { status: 400 });
    }

    // 1. Query the order and join product details to verify payment completion
    let query = supabase.from("orders").select("*, products(file_path, title)");
    if (orderId) query = query.eq("id", orderId);
    else query = query.eq("tx_signature", txSignature);

    const { data: order, error: orderError } = await query.single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order record not found." }, { status: 404 });
    }

    if (order.payment_status !== "completed") {
      return NextResponse.json({ error: "Access denied: Payment has not been completed or verified." }, { status: 403 });
    }

    const filePath = order.products?.file_path;
    if (!filePath) {
      return NextResponse.json({ error: "Associated product file path not found." }, { status: 404 });
    }

    // 2. Generate a short-lived secure signed URL (expires in 60 seconds)
    const { data: signedUrlData, error: signError } = await supabase.storage
      .from("product-files")
      .createSignedUrl(filePath, 60);

    if (signError || !signedUrlData) {
      throw signError || new Error("Failed to generate secure download link.");
    }

    // 3. Redirect the verified buyer directly to the secure signed URL download stream
    return NextResponse.redirect(signedUrlData.signedUrl);
  } catch (err: any) {
    console.error("Download authorization error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}