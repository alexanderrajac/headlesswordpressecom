import { NextResponse } from "next/server";
import { getProductReviews } from "@/lib/woocommerce";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = Number(searchParams.get("productId") || "");
    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
    const reviews = await getProductReviews(productId);
    return NextResponse.json(reviews);
  } catch (e) {
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

