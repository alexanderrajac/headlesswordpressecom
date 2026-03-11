export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  stock_status: "instock" | "outofstock" | "onbackorder";
  stock_quantity: number | null;
  images: WCImage[];
  categories: WCCategory[];
  tags: WCTag[];
  attributes: WCAttribute[];
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  meta_data: WCMetaData[];
  weight: string;
  dimensions: { length: string; width: string; height: string };
  shipping_class: string;
  reviews_allowed: boolean;
  status: string;
  featured: boolean;
}

export interface WCImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WCTag {
  id: number;
  name: string;
  slug: string;
}

export interface WCAttribute {
  id: number;
  name: string;
  options: string[];
}

export interface WCMetaData {
  id?: number;
  key: string;
  value: string;
}

export interface WCReview {
  id: number;
  date_created: string;
  review: string;
  rating: number;
  reviewer: string;
  reviewer_email: string;
  verified: boolean;
}

export interface WCOrder {
  id: number;
  status: string;
  currency: string;
  total: string;
  billing: WCBilling;
  shipping: WCShipping;
  line_items: WCLineItem[];
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  date_created: string;
  order_key: string;
  meta_data: WCMetaData[];
}

export interface WCBilling {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface WCShipping {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface WCLineItem {
  product_id: number;
  quantity: number;
  variation_id?: number;
}

export interface CartItem {
  id: number;
  product: WCProduct;
  quantity: number;
  price: number;
}

export interface CheckoutForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  transaction_id: string;
  notes: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  orderby?: string;
  order?: "asc" | "desc";
  search?: string;
  page?: number;
  per_page?: number;
}
