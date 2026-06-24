'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { WishlistItem } from '@/types';
import { getWishlist, removeFromWishlist } from '@/lib/db/wishlist';
import { addCartItem } from '@/lib/db/cart';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const data = await getWishlist();
        setItems(data);
      } catch {
        toast({ title: 'Please sign in to view wishlist', variant: 'destructive' });
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
      toast({ title: 'Error removing item', variant: 'destructive' });
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-6">Save items you love for later.</p>
        <Button asChild>
          <Link href="/shop">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-card overflow-hidden group"
          >
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
