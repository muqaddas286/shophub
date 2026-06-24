import { supabase } from './supabase';
import { Product, Category, Review } from '@/types';

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), images:product_images(*)')
    .eq('featured', true)
    .limit(8);
  if (error) throw error;
  return data || [];
}

export async function getBestSellers(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), images:product_images(*)')
    .eq('best_seller', true)
    .limit(8);
  if (error) throw error;
  return data || [];
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single();
  if (!category) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), images:product_images(*)')
    .eq('category_id', category.id);
  if (error) throw error;
  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), images:product_images(*)')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data;
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), images:product_images(*)')
    .ilike('name', `%${query}%`)
    .limit(20);
  if (error) throw error;
  return data || [];
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), images:product_images(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
