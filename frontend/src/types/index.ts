export interface B2bTier {
  qty_label: string;
  price: number;
  savings_percent: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  retail_price: number;
  b2b_price_tiers: B2bTier[];
  b2b_min_price: number | null;
  stock_status: "in_stock" | "out_of_stock" | "pre_order";
  images: string[];
  cover_image: string | null;
  is_customizable: boolean;
  weight_grams: number;
  category: { id: number; name: string; slug: string } | null;
  meta_title: string | null;
  meta_description: string | null;
  reviews_summary?: {
    average_rating: number;
    total_count: number;
    distribution: Record<string, number>;
  };
  related_products?: ProductListItem[];
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  retail_price: number;
  b2b_min_price: number | null;
  stock_status: "in_stock" | "out_of_stock" | "pre_order";
  cover_image: string | null;
  is_customizable: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  occasion_type: string;
  children: Category[];
}

export interface CartItem {
  product_id: number;
  name: string;
  slug: string;
  image: string | null;
  retail_price: number;
  quantity: number;
  line_total: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  voucher: { code: string; type: string; value: number } | null;
  discount_amount: number;
  total_weight: number;
  total_items: number;
}

export interface ShippingOption {
  fee: number;
  estimated_days: number;
  note?: string;
}

export interface Order {
  order_number: string;
  status: string;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total: number;
  shipping_address: Record<string, string>;
  delivery_type: "standard" | "express";
  requested_delivery_date: string | null;
  gift_message: string | null;
  customer_note: string | null;
  payment_method: string;
  payment_status: string;
  paid_at: string | null;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_snapshot: {
    name: string;
    slug: string;
    image: string | null;
    sku: string | null;
  };
}
