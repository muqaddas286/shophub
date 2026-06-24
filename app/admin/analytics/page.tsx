'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminAnalyticsPage() {
  const [orderData, setOrderData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const { data: orders } = await supabase.from('orders').select('created_at, total_amount').order('created_at');
        const { data: products } = await supabase.from('products').select('category_id, price');
        const { data: categories } = await supabase.from('categories').select('id, name');

        // Group orders by date
        const dateMap: Record<string, number> = {};
        orders?.forEach((o) => {
          const date = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dateMap[date] = (dateMap[date] || 0) + o.total_amount;
        });
        setOrderData(Object.entries(dateMap).map(([name, value]) => ({ name, value })));

        // Group products by category
        const catMap: Record<string, number> = {};
        products?.forEach((p: any) => {
          const cat = categories?.find((c: any) => c.id === p.category_id)?.name || 'Uncategorized';
          catMap[cat] = (catMap[cat] || 0) + 1;
        });
        setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })));
      } catch {
        toast({ title: 'Error loading analytics', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-lg font-bold mb-4">Revenue by Date</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h2 className="text-lg font-bold mb-4">Products by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
