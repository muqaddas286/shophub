'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { getAllProducts } from '@/lib/db/products';
import { supabase } from '@/lib/db/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setFiltered(data);
      } catch {
        toast({ title: 'Error loading products', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  useEffect(() => {
    if (search) {
      setFiltered(products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFiltered(products);
    }
  }, [search, products]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter((p) => p.id !== id));
      toast({ title: 'Product deleted' });
    } catch {
      toast({ title: 'Error deleting product', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <Button className="gap-1">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
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
                    <th className="text-left py-3 px-4">Product</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-right py-3 px-4">Price</th>
                    <th className="text-right py-3 px-4">Stock</th>
                    <th className="text-center py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted relative shrink-0">
                            <Image
                              src={product.images?.[0]?.url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium line-clamp-1">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{product.category?.name || '-'}</td>
                      <td className="py-3 px-4 text-right font-medium">${product.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">{product.inventory_count}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 hover:bg-accent rounded-lg">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
