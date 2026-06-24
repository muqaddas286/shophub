import { supabase } from './supabase';
import { Order, OrderItem, Address } from '@/types';

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export async function createOrder(
  order: Omit<Order, 'id' | 'created_at' | 'updated_at'>,
  items: Omit<OrderItem, 'id' | 'created_at'>[]
): Promise<Order | null> {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();
  if (orderError || !orderData) throw orderError;

  const orderItems = items.map((item) => ({
    ...item,
    order_id: orderData.id,
  }));
  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  return orderData;
}

export async function getAddresses(): Promise<Address[]> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .order('is_default', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addAddress(address: Omit<Address, 'id' | 'user_id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('addresses').insert(address);
  if (error) throw error;
}

export async function updateAddress(id: string, address: Partial<Address>): Promise<void> {
  const { error } = await supabase.from('addresses').update(address).eq('id', id);
  if (error) throw error;
}

export async function deleteAddress(id: string): Promise<void> {
  const { error } = await supabase.from('addresses').delete().eq('id', id);
  if (error) throw error;
}
