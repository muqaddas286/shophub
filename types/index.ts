export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  parent_id: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  inventory_count: number;
  category_id: string | null;
  rating: number;
  review_count: number;
  featured: boolean;
  best_seller: boolean;
  tags: string[] | null;
  brand: string | null;
  images?: ProductImage[];
  category?: Category;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  position: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  helpful_count: number;
  created_at: string;
  profiles?: { full_name: string | null; avatar_url: string | null };
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  country: string;
  is_default: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  shipping_address: Record<string, unknown>;
  billing_address: Record<string, unknown> | null;
  stripe_payment_intent_id: string | null;
  notes: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
}
