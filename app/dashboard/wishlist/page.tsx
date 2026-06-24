'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { WishlistItem } from '@/types';
import { getWishlist, removeFromWishlist } from '@/lib/db/wishlist';
import { addCartItem } from '@/lib/db/cart';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function DashboardWishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const data = await getWishlist();
        setItems(data);
      } catch {
        toast({ title: 'Please sign in', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  const handleRemove = async (id: string) => {
    try {
      await removeFromWishlist(id);
      setItems(items.filter((i) => i.id !== id));
      toast({ title: 'Removed from wishlist' });
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addCartItem(productId, 1);
      toast({ title: 'Added to cart' });
    } catch {
      toast({ title: 'Error adding to cart', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
            <Button asChild>
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border bg-card overflow-hidden group">
                <Link href={`/shop/product/${item.product?.slug}`} className="block aspect-square relative overflow-hidden bg-muted">
                  <Image
                    src={item.product?.images?.[0]?.url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={item.product?.name || ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>
                <div className="p-4">
                  <Link href={`/shop/product/${item.product?.slug}`}>
                    <h3 className="font-medium line-clamp-1 hover:text-blue-600 transition-colors">{item.product?.name}</h3>
                  </Link>
                  <div className="text-lg font-bold mt-1">${item.product?.price.toFixed(2)}</div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 gap-1" onClick={() => handleAddToCart(item.product_id)}>
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRemove(item.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
