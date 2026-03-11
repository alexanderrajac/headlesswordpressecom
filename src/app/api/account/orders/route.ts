import { NextResponse } from "next/server";
import { getCustomerOrders } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = Number(searchParams.get("customerId") || "");
    if (!customerId) return NextResponse.json({ error: "customerId required" }, { status: 400 });
    const orders = await getCustomerOrders(customerId);
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

