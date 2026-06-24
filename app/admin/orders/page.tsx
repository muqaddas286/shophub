'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db/supabase';
import { Order } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setOrders(data || []);
        setFiltered(data || []);
      } catch {
        toast({ title: 'Error loading orders', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  useEffect(() => {
    if (search) {
      setFiltered(orders.filter((o) => o.id.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFiltered(orders);
    }
  }, [search, orders]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
      toast({ title: 'Order status updated' });
    } catch {
      toast({ title: 'Error updating status', variant: 'destructive' });
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Payment</th>
                    <th className="text-right py-3 px-4">Total</th>
                    <th className="text-center py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="py-3 px-4 font-medium">#{order.id.slice(0, 8)}</td>
                      <td className="py-3 px-4 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${statusColors[order.status] || 'bg-muted'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{order.payment_status}</td>
                      <td className="py-3 px-4 text-right font-medium">${order.total_amount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
