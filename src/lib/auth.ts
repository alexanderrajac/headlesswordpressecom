import axios from "axios";

const BASE_URL = process.env.WP_URL || process.env.NEXT_PUBLIC_WP_URL;
const WC_KEY = process.env.WC_KEY;
const WC_SECRET = process.env.WC_SECRET;

const wcApi = axios.create({
  baseURL: `${BASE_URL}/wp-json/wc/v3`,
  auth: {
    username: WC_KEY || "",
    password: WC_SECRET || "",
  },
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export interface WCCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  billing: {
    phone: string;
    email: string;
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  date_created: string;
  avatar_url: string;
}

export interface WCCustomerOrder {
  id: number;
  status: string;
  total: string;
  currency: string;
  date_created: string;
  line_items: { name: string; quantity: number; total: string }[];
}

export async function registerCustomer(data: {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  phone: string;
}): Promise<WCCustomer> {
  const res = await wcApi.post("/customers", {
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    username: data.username,
    password: data.password,
    billing: {
      phone: data.phone,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    },
  });
  return res.data;
}

export async function findCustomerByEmail(email: string): Promise<WCCustomer | null> {
  const res = await wcApi.get("/customers", { params: { email, per_page: 1 } });
  return res.data[0] || null;
}

export async function getCustomer(id: number): Promise<WCCustomer> {
  const res = await wcApi.get(`/customers/${id}`);
  return res.data;
}

export async function getCustomerOrders(customerId: number): Promise<WCCustomerOrder[]> {
  const res = await wcApi.get("/orders", {
    params: { customer: customerId, per_page: 10, orderby: "date", order: "desc" },
  });
  return res.data;
}

export async function updateCustomer(
  id: number,
  data: Partial<{ first_name: string; last_name: string; billing: Record<string, string> }>
): Promise<WCCustomer> {
  const res = await wcApi.put(`/customers/${id}`, data);
  return res.data;
}
