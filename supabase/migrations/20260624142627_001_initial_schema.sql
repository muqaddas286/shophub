/*
# Initial eCommerce Schema

1. New Tables
- `categories` - Product categories with icons and descriptions
- `products` - Main product catalog with pricing, ratings, and inventory
- `product_images` - Multiple images per product for gallery
- `reviews` - Customer product reviews and ratings
- `cart_items` - Shopping cart items linked to users
- `orders` - Order records with status tracking
- `order_items` - Individual items within each order
- `addresses` - User shipping/billing addresses
- `wishlist` - User wishlist items
- `profiles` - Extended user profile information

2. Security
- Enable RLS on all tables
- Owner-scoped policies for user data
- Public read for products and categories
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  image_url text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  price numeric(10,2) NOT NULL,
  compare_at_price numeric(10,2),
  sku text UNIQUE,
  inventory_count integer NOT NULL DEFAULT 0,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  rating numeric(2,1) DEFAULT 0,
  review_count integer DEFAULT 0,
  featured boolean DEFAULT false,
  best_seller boolean DEFAULT false,
  tags text[],
  brand text,
  weight numeric(8,2),
  dimensions jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  body text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Profiles (extended user info)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text,
  postal_code text,
  country text DEFAULT 'US',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  total_amount numeric(10,2) NOT NULL,
  shipping_address jsonb NOT NULL,
  billing_address jsonb,
  stripe_payment_intent_id text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text,
  quantity integer NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Categories: public read
DROP POLICY IF EXISTS "public_select_categories" ON categories;
CREATE POLICY "public_select_categories" ON categories FOR SELECT TO anon, authenticated USING (true);

-- Products: public read
DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products" ON products FOR SELECT TO anon, authenticated USING (true);

-- Product Images: public read
DROP POLICY IF EXISTS "public_select_product_images" ON product_images;
CREATE POLICY "public_select_product_images" ON product_images FOR SELECT TO anon, authenticated USING (true);

-- Reviews: public read, authenticated insert/update/delete own
DROP POLICY IF EXISTS "public_select_reviews" ON reviews;
CREATE POLICY "public_select_reviews" ON reviews FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_reviews" ON reviews;
CREATE POLICY "insert_own_reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reviews" ON reviews;
CREATE POLICY "update_own_reviews" ON reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reviews" ON reviews;
CREATE POLICY "delete_own_reviews" ON reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Profiles: read own, insert/update own
DROP POLICY IF EXISTS "select_own_profiles" ON profiles;
CREATE POLICY "select_own_profiles" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profiles" ON profiles;
CREATE POLICY "insert_own_profiles" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profiles" ON profiles;
CREATE POLICY "update_own_profiles" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Addresses: CRUD own
DROP POLICY IF EXISTS "select_own_addresses" ON addresses;
CREATE POLICY "select_own_addresses" ON addresses FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_addresses" ON addresses;
CREATE POLICY "insert_own_addresses" ON addresses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_addresses" ON addresses;
CREATE POLICY "update_own_addresses" ON addresses FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_addresses" ON addresses;
CREATE POLICY "delete_own_addresses" ON addresses FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Cart Items: CRUD own
DROP POLICY IF EXISTS "select_own_cart" ON cart_items;
CREATE POLICY "select_own_cart" ON cart_items FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_cart" ON cart_items;
CREATE POLICY "insert_own_cart" ON cart_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_cart" ON cart_items;
CREATE POLICY "update_own_cart" ON cart_items FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_cart" ON cart_items;
CREATE POLICY "delete_own_cart" ON cart_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Wishlist: CRUD own
DROP POLICY IF EXISTS "select_own_wishlist" ON wishlist;
CREATE POLICY "select_own_wishlist" ON wishlist FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_wishlist" ON wishlist;
CREATE POLICY "insert_own_wishlist" ON wishlist FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_wishlist" ON wishlist;
CREATE POLICY "delete_own_wishlist" ON wishlist FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Orders: read own
DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Order Items: read via order
DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_best_seller ON products(best_seller);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
