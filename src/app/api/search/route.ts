import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/woocommerce";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    if (q.length < 2) return NextResponse.json([]);
    const results = await searchProducts(q);
    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
  }
}

