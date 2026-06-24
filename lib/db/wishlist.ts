import { supabase } from './supabase';
import { WishlistItem } from '@/types';

export async function getWishlist(): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from('wishlist')
    .select('*, product:products(*, images:product_images(*))')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addToWishlist(productId: string): Promise<void> {
  const { error } = await supabase.from('wishlist').insert({ product_id: productId });
  if (error) throw error;
}

export async function removeFromWishlist(id: string): Promise<void> {
  const { error } = await supabase.from('wishlist').delete().eq('id', id);
  if (error) throw error;
}
