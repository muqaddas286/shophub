'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store/useStore';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toast } = useToast();
  const cart = useStore((s) => s.cart);
  const addToCart = useStore((s) => s.addToCart);
  const wishlist = useStore((s) => s.wishlist);
  const addWishlistLocal = useStore((s) => s.addToWishlist);
  const removeWishlistLocal = useStore((s) => s.removeFromWishlist);

  const isInWishlist = wishlist.some((w) => w.product_id === product.id);
  const cartItem = cart.find((c) => c.product_id === product.id);

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: crypto.randomUUID(),
      user_id: '',
      product_id: product.id,
      quantity: 1,
      product,
    });
    toast({ title: 'Added to cart', description: product.name });
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      const item = wishlist.find((w) => w.product_id === product.id);
      if (item) removeWishlistLocal(item.id);
      toast({ title: 'Removed from wishlist' });
    } else {
      addWishlistLocal({ id: crypto.randomUUID(), user_id: '', product_id: product.id, product });
      toast({ title: 'Added to wishlist' });
    }
  };

  const imageUrl = product.images?.[0]?.url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-shadow"
    >
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          -{discount}%
        </div>
      )}

      <button
        onClick={handleToggleWishlist}
        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
      >
        <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      <Link href={`/shop/product/${product.slug}`} className="block aspect-square overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-3 sm:p-4">
        <div className="text-xs text-muted-foreground mb-1">{product.brand || product.category?.name}</div>
        <Link href={`/shop/product/${product.slug}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-blue-600 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.review_count})</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
          {product.compare_at_price && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.compare_at_price.toFixed(2)}
            </span>
          )}
        </div>

        <Button onClick={handleAddToCart} size="sm" className="w-full gap-2">
          <ShoppingCart className="w-4 h-4" />
          {cartItem ? `In Cart (${cartItem.quantity})` : 'Add to Cart'}
        </Button>
      </div>
    </motion.div>
  );
}
