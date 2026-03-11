import { NextResponse } from "next/server";
import { getCategories } from "@/lib/woocommerce";
import type { WCCategory } from "@/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories satisfies WCCategory[]);
  } catch (e) {
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

