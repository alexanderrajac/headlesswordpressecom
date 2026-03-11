import { NextResponse } from "next/server";
import { registerCustomer } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email: string;
      first_name: string;
      last_name: string;
      username: string;
      password: string;
      phone: string;
    };
    const customer = await registerCustomer(body);
    return NextResponse.json(customer);
  } catch (e: unknown) {
    // Pass through WooCommerce error message if present
    const err = e as { response?: { data?: unknown } };
    return NextResponse.json(err.response?.data || { error: "Registration failed" }, { status: 400 });
  }
}

