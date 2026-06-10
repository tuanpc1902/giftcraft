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
  // Admin-only fields (present when fetched from /admin/products)
  is_active?: boolean;
  version?: number;
  sku?: string | null;
  weight_grams?: number;
  category?: { id: number; name: string; slug: string } | null;
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
  id: number;
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

export interface B2bQuote {
  id: number;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  occasion: string | null;
  quantity_requested: number;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  custom_requirements: string | null;
  status: "new" | "reviewing" | "quoted" | "approved" | "in_production" | "delivered" | "cancelled";
  quoted_price: number | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string;
  author: string;
  published_at: string;
  read_minutes: number;
}

export interface PortfolioProject {
  id: number;
  title: string;
  client_name: string | null;
  occasion: string;
  industry: string | null;
  quantity: number | null;
  cover_image: string;
  gallery_images: string[];
  description: string | null;
  is_featured: boolean;
  created_at: string;
}
