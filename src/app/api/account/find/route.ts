import { NextResponse } from "next/server";
import { findCustomerByEmail } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = (searchParams.get("email") || "").trim();
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
    const customer = await findCustomerByEmail(email);
    return NextResponse.json(customer);
  } catch {
    return NextResponse.json({ error: "Failed to find customer" }, { status: 500 });
  }
}

