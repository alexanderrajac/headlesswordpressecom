import { NextResponse } from "next/server";
import { createOrder } from "@/lib/woocommerce";
import type { WCOrder } from "@/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<WCOrder>;
    const order = await createOrder(body);
    return NextResponse.json(order);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

