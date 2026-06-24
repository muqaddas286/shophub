/*
# Seed eCommerce Data

1. Seed categories with icons and descriptions
2. Seed products with images, ratings, and pricing
3. Seed product images for galleries

This provides demo data for the storefront.
*/

-- Insert Categories
INSERT INTO categories (name, slug, description, icon) VALUES
('Electronics', 'electronics', 'Latest gadgets and electronic devices', 'laptop'),
('Fashion', 'fashion', 'Trendy clothing and accessories', 'shirt'),
('Home & Living', 'home-living', 'Furniture and home decor', 'home'),
('Sports', 'sports', 'Sports equipment and outdoor gear', 'dumbbell'),
('Books', 'books', 'Books, e-books, and educational materials', 'book-open'),
('Beauty', 'beauty', 'Skincare, makeup, and personal care', 'sparkles')
ON CONFLICT (slug) DO NOTHING;

-- Insert Products
INSERT INTO products (name, slug, description, short_description, price, compare_at_price, inventory_count, category_id, rating, review_count, featured, best_seller, tags, brand) VALUES
('Wireless Noise-Canceling Headphones', 'wireless-noise-canceling-headphones', 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and superior sound quality.', 'Premium ANC headphones with 30h battery', 299.99, 349.99, 150, (SELECT id FROM categories WHERE slug = 'electronics'), 4.8, 124, true, true, ARRAY['audio', 'wireless', 'headphones'], 'SoundMax'),
('Smart Watch Pro', 'smart-watch-pro', 'Advanced fitness tracking, heart rate monitoring, GPS, and 7-day battery life in a sleek design.', 'Advanced fitness tracker with GPS', 399.99, 449.99, 89, (SELECT id FROM categories WHERE slug = 'electronics'), 4.6, 89, true, true, ARRAY['wearable', 'fitness', 'smartwatch'], 'TechGear'),
('Organic Cotton T-Shirt', 'organic-cotton-t-shirt', 'Soft, breathable organic cotton t-shirt in a classic fit. Sustainably sourced and ethically produced.', 'Soft organic cotton classic fit tee', 29.99, 39.99, 500, (SELECT id FROM categories WHERE slug = 'fashion'), 4.5, 234, false, true, ARRAY['clothing', 'organic', 'sustainable'], 'EcoWear'),
('Modern Sofa - 3 Seater', 'modern-sofa-3-seater', 'Elegant mid-century modern sofa with premium fabric upholstery and solid wood legs.', 'Mid-century modern 3-seater sofa', 899.99, 1199.99, 25, (SELECT id FROM categories WHERE slug = 'home-living'), 4.7, 56, true, false, ARRAY['furniture', 'sofa', 'living-room'], 'HomeStyle'),
('Yoga Mat Premium', 'yoga-mat-premium', 'Extra thick, non-slip yoga mat with alignment lines. Eco-friendly TPE material.', 'Extra thick non-slip eco yoga mat', 49.99, 69.99, 200, (SELECT id FROM categories WHERE slug = 'sports'), 4.9, 312, false, true, ARRAY['fitness', 'yoga', 'wellness'], 'ZenFit'),
('Bestseller Novel Collection', 'bestseller-novel-collection', 'A curated collection of 5 bestselling novels from award-winning authors.', '5 bestselling novels collection', 59.99, 79.99, 75, (SELECT id FROM categories WHERE slug = 'books'), 4.4, 45, false, false, ARRAY['books', 'fiction', 'collection'], 'PageTurner'),
('Hydrating Face Serum', 'hydrating-face-serum', 'Advanced hydrating serum with hyaluronic acid and vitamin C for glowing skin.', 'Hyaluronic acid vitamin C serum', 68.99, 89.99, 120, (SELECT id FROM categories WHERE slug = 'beauty'), 4.7, 178, true, true, ARRAY['skincare', 'serum', 'hydration'], 'GlowLab'),
('4K Ultra HD Monitor 27"', '4k-ultra-hd-monitor-27', 'Stunning 27-inch 4K monitor with IPS panel, 99% sRGB coverage, and USB-C connectivity.', '27-inch 4K IPS monitor with USB-C', 499.99, 599.99, 40, (SELECT id FROM categories WHERE slug = 'electronics'), 4.5, 67, true, false, ARRAY['monitor', 'display', '4k'], 'ViewPro'),
('Leather Crossbody Bag', 'leather-crossbody-bag', 'Genuine Italian leather crossbody bag with adjustable strap and multiple compartments.', 'Italian leather crossbody bag', 159.99, 199.99, 85, (SELECT id FROM categories WHERE slug = 'fashion'), 4.6, 92, false, true, ARRAY['bag', 'leather', 'accessories'], 'LuxeLeather'),
('Smart Home Hub', 'smart-home-hub', 'Central hub for all your smart home devices. Compatible with 1000+ devices.', 'Smart home central control hub', 129.99, 149.99, 60, (SELECT id FROM categories WHERE slug = 'electronics'), 4.3, 34, false, false, ARRAY['smarthome', 'automation', 'hub'], 'SmartLife')
ON CONFLICT (slug) DO NOTHING;

-- Insert Product Images
INSERT INTO product_images (product_id, url, alt_text, position) VALUES
((SELECT id FROM products WHERE slug = 'wireless-noise-canceling-headphones'), 'https://images.pexels.com/photos/3394656/pexels-photo-3394656.jpeg?auto=compress&cs=tinysrgb&w=800', 'Wireless Noise-Canceling Headphones - Front', 1),
((SELECT id FROM products WHERE slug = 'wireless-noise-canceling-headphones'), 'https://images.pexels.com/photos/610945/pexels-photo-610945.jpeg?auto=compress&cs=tinysrgb&w=800', 'Wireless Noise-Canceling Headphones - Side', 2),
((SELECT id FROM products WHERE slug = 'smart-watch-pro'), 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800', 'Smart Watch Pro - Main', 1),
((SELECT id FROM products WHERE slug = 'smart-watch-pro'), 'https://images.pexels.com/photos/267391/pexels-photo-267391.jpeg?auto=compress&cs=tinysrgb&w=800', 'Smart Watch Pro - Side', 2),
((SELECT id FROM products WHERE slug = 'organic-cotton-t-shirt'), 'https://images.pexels.com/photos/991509/pexels-photo-991509.jpeg?auto=compress&cs=tinysrgb&w=800', 'Organic Cotton T-Shirt - Front', 1),
((SELECT id FROM products WHERE slug = 'modern-sofa-3-seater'), 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800', 'Modern Sofa - Front View', 1),
((SELECT id FROM products WHERE slug = 'modern-sofa-3-seater'), 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 'Modern Sofa - Living Room', 2),
((SELECT id FROM products WHERE slug = 'yoga-mat-premium'), 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800', 'Yoga Mat Premium - Rolled Out', 1),
((SELECT id FROM products WHERE slug = 'bestseller-novel-collection'), 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800', 'Bestseller Novel Collection', 1),
((SELECT id FROM products WHERE slug = 'hydrating-face-serum'), 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=800', 'Hydrating Face Serum - Bottle', 1),
((SELECT id FROM products WHERE slug = '4k-ultra-hd-monitor-27'), 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=800', '4K Monitor - Front', 1),
((SELECT id FROM products WHERE slug = 'leather-crossbody-bag'), 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800', 'Leather Crossbody Bag - Main', 1),
((SELECT id FROM products WHERE slug = 'smart-home-hub'), 'https://images.pexels.com/photos/4790255/pexels-photo-4790255.jpeg?auto=compress&cs=tinysrgb&w=800', 'Smart Home Hub - Device', 1)
ON CONFLICT DO NOTHING;
