'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/db/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, ordersRes, customersRes] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact' }),
          supabase.from('orders').select('*', { count: 'exact' }),
          supabase.from('profiles').select('id', { count: 'exact' }),
        ]);

        const { data: recentOrders } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .order('created_at', { ascending: false })
          .limit(5);

        const revenue = recentOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

        setStats({
          totalProducts: productsRes.count || 0,
          totalOrders: ordersRes.count || 0,
          totalCustomers: customersRes.count || 0,
          totalRevenue: revenue,
          recentOrders: recentOrders || [],
        });
      } catch {
        toast({ title: 'Error loading dashboard', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  const statCards = [
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, trend: '+12%', trendUp: true },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, trend: '+8%', trendUp: true },
    { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, trend: '+15%', trendUp: true },
    { label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, trend: '+5%', trendUp: true },
  ];

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border bg-card p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{card.label}</span>
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className={`flex items-center gap-1 text-xs mt-1 ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {card.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {card.trend}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Recent Orders */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          {stats?.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 px-2">Order ID</th>
                    <th className="text-left py-2 px-2">Customer</th>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-right py-2 px-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="py-3 px-2 font-medium">#{order.id.slice(0, 8)}</td>
                      <td className="py-3 px-2 text-muted-foreground">{order.user_id?.slice(0, 8)}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-medium">${order.total_amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
