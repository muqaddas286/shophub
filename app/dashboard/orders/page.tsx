'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Order } from '@/types';
import { getOrders } from '@/lib/db/orders';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch {
        toast({ title: 'Error loading orders', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border bg-card p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</span>
                    <div className="text-sm">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${statusColors[order.status] || 'bg-muted'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  {order.items?.slice(0, 3).map((item) => (
                    <div key={item.id} className="w-16 h-16 rounded-lg overflow-hidden bg-muted relative">
                      <Image
                        src={item.product_image || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-bold">${order.total_amount.toFixed(2)}</div>
                  <Link href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    View Details <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
