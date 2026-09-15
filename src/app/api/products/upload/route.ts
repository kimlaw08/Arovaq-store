import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const productFile = formData.get("product_file") as File;
    const coverFile = formData.get("cover_file") as File;
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const creatorId = formData.get("creator_id") as string;
    const creatorWallet = formData.get("creator_wallet") as string;
    const priceUsdt = formData.get("price_usdt") as string;
    const description = formData.get("description") as string;

    // 1. Validate main product file
    if (!productFile || productFile.size === 0) {
      return NextResponse.json({ error: "Upload rejected: Digital product file is missing or empty." }, { status: 400 });
    }

    // 2. Generate Cryptographic Fingerprint (SHA-256) for Provenance & Anti-Plagiarism
    const arrayBuffer = await productFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentHash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Check for duplicate content hash in database
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, title")
      .eq("content_hash", contentHash)
      .single();

    if (existingProduct) {
      return NextResponse.json(
        { error: `Upload rejected: This exact file has already been listed under "${existingProduct.title}".` },
        { status: 409 }
      );
    }

    // 3. Upload Digital Product File to Storage ('product-files' bucket)
    const productFileName = `${Date.now()}-${productFile.name}`;
    const { error: productUploadError } = await supabase.storage
      .from("product-files")
      .upload(productFileName, buffer, { contentType: productFile.type, upsert: false });

    if (productUploadError) throw productUploadError;

    // 4. Upload Cover Image to Storage ('product-covers' bucket) if provided
    let coverImageUrl = null;
    if (coverFile && coverFile.size > 0) {
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
      const coverFileName = `${Date.now()}-${coverFile.name}`;
      
      const { error: coverUploadError } = await supabase.storage
        .from("product-covers")
        .upload(coverFileName, coverBuffer, { contentType: coverFile.type, upsert: false });

      if (!coverUploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("product-covers")
          .getPublicUrl(coverFileName);
        coverImageUrl = publicUrlData.publicUrl;
      }
    }

    // 5. Register Product in Supabase Table with storage file path reference
    const { data: productData, error: dbError } = await supabase
      .from("products")
      .insert([
        {
          slug,
          creator_id: creatorId,
          title,
          description,
          price_usdt: parseFloat(priceUsdt),
          creator_wallet: creatorWallet,
          content_hash: contentHash,
          file_size: productFile.size,
          cover_image_url: coverImageUrl,
          file_path: productFileName, // <--- Storage file path reference for signed URL generation
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      success: true,
      message: "Product successfully fingerprinted and listed!",
      product: productData,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to list product" }, { status: 500 });
  }
}