import { supabase } from './supabase';
import { CartItem } from '@/types';

export async function getCartItems(): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, product:products(*, images:product_images(*))')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addCartItem(productId: string, quantity: number = 1): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .upsert(
      { product_id: productId, quantity },
      { onConflict: 'user_id,product_id' }
    );
  if (error) throw error;
}

export async function updateCartItem(id: string, quantity: number): Promise<void> {
  if (quantity <= 0) {
    const { error } = await supabase.from('cart_items').delete().eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', id);
    if (error) throw error;
  }
}

export async function removeCartItem(id: string): Promise<void> {
  const { error } = await supabase.from('cart_items').delete().eq('id', id);
  if (error) throw error;
}

export async function clearCart(): Promise<void> {
  const { error } = await supabase.from('cart_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw error;
}
