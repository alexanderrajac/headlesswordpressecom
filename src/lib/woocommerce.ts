import axios from "axios";
import type { WCProduct, WCOrder, WCReview, ProductFilters } from "@/types";

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

// Cache categories to avoid repeated API calls
let cachedCategories: { id: number; name: string; slug: string }[] | null = null;
let cacheExpiry = 0;

export async function getCategories() {
  const now = Date.now();
  if (cachedCategories && now < cacheExpiry) {
    return cachedCategories;
  }
  const res = await wcApi.get("/products/categories", {
    params: { per_page: 100, hide_empty: true },
  });
  cachedCategories = res.data;
  cacheExpiry = now + 5 * 60 * 1000; // Cache for 5 minutes
  return res.data;
}

export async function getProducts(filters: ProductFilters = {}): Promise<{
  products: WCProduct[];
  total: number;
  totalPages: number;
}> {
  const params: Record<string, string | number | boolean> = {
    per_page: filters.per_page || 20,
    page: filters.page || 1,
    status: "publish",
  };

  // WooCommerce API expects numeric category ID, so resolve slug to ID
  if (filters.category) {
    const cats = await getCategories();
    const match = cats.find((c: { id: number; slug: string }) => c.slug === filters.category);
    if (match) {
      params.category = match.id;
    }
  }
  if (filters.minPrice !== undefined) params.min_price = filters.minPrice;
  if (filters.maxPrice !== undefined) params.max_price = filters.maxPrice;
  if (filters.orderby) params.orderby = filters.orderby;
  if (filters.order) params.order = filters.order;
  if (filters.search) params.search = filters.search;
  if (filters.inStock) params.stock_status = "instock";

  const res = await wcApi.get("/products", { params });
  const total = parseInt(res.headers["x-wp-total"] || "0");
  const totalPages = parseInt(res.headers["x-wp-totalpages"] || "1");

  return { products: res.data, total, totalPages };
}

export async function getProduct(slug: string): Promise<WCProduct> {
  const res = await wcApi.get("/products", { params: { slug, status: "publish" } });
  if (!res.data[0]) throw new Error("Product not found");
  return res.data[0];
}

export async function getProductById(id: number): Promise<WCProduct> {
  const res = await wcApi.get(`/products/${id}`);
  return res.data;
}

export async function getFeaturedProducts(): Promise<WCProduct[]> {
  const res = await wcApi.get("/products", {
    params: { featured: true, per_page: 8, status: "publish" },
  });
  return res.data;
}

export async function getRelatedProducts(ids: number[]): Promise<WCProduct[]> {
  if (!ids.length) return [];
  const res = await wcApi.get("/products", {
    params: { include: ids.slice(0, 6).join(","), per_page: 6 },
  });
  return res.data;
}

export async function getProductReviews(productId: number): Promise<WCReview[]> {
  const res = await wcApi.get("/products/reviews", {
    params: { product: productId, per_page: 20 },
  });
  return res.data;
}

export async function searchProducts(query: string): Promise<WCProduct[]> {
  const res = await wcApi.get("/products", {
    params: { search: query, per_page: 8, status: "publish" },
  });
  return res.data;
}

export async function createOrder(orderData: Partial<WCOrder>): Promise<WCOrder> {
  const res = await wcApi.post("/orders", orderData);
  return res.data;
}

export async function updateOrderStatus(
  orderId: number,
  status: string,
  transactionId?: string
): Promise<WCOrder> {
  const payload: Record<string, string> = { status };
  if (transactionId) payload.transaction_id = transactionId;
  const res = await wcApi.put(`/orders/${orderId}`, payload);
  return res.data;
}

export async function getOrder(orderId: number): Promise<WCOrder> {
  const res = await wcApi.get(`/orders/${orderId}`);
  return res.data;
}

export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function getDiscountPercent(regular: string, sale: string): number {
  const r = parseFloat(regular);
  const s = parseFloat(sale);
  if (!r || !s) return 0;
  return Math.round(((r - s) / r) * 100);
}
