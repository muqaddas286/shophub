'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Review } from '@/types';
import { getProductBySlug, getProductReviews } from '@/lib/db/products';
import { useStore } from '@/lib/store/useStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/product/ProductCard';
import { supabase } from '@/lib/db/supabase';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  const addToCart = useStore((s) => s.addToCart);
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const addWishlistLocal = useStore((s) => s.addToWishlist);
  const removeWishlistLocal = useStore((s) => s.removeFromWishlist);

  const isInWishlist = product ? wishlist.some((w) => w.product_id === product.id) : false;
  const cartItem = product ? cart.find((c) => c.product_id === product.id) : null;

  useEffect(() => {
    async function load() {
      try {
        const [p, r] = await Promise.all([
          getProductBySlug(slug),
          getProductReviews(slug),
        ]);
        setProduct(p);
        if (p) {
          const { data } = await supabase
            .from('products')
            .select('*, images:product_images(*)')
            .eq('category_id', p.category_id)
            .neq('id', p.id)
            .limit(4);
          setRelatedProducts(data || []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: crypto.randomUUID(),
      user_id: '',
      product_id: product.id,
      quantity,
      product,
    });
    toast({ title: 'Added to cart', description: `${quantity} x ${product.name}` });
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isInWishlist) {
      const item = wishlist.find((w) => w.product_id === product.id);
      if (item) removeWishlistLocal(item.id);
      toast({ title: 'Removed from wishlist' });
    } else {
      addWishlistLocal({ id: crypto.randomUUID(), user_id: '', product_id: product.id, product });
      toast({ title: 'Added to wishlist' });
    }
  };

  const discount = product?.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-muted rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-1/2" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [{ url: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800' }];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-foreground">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-xl overflow-hidden bg-muted relative"
            >
              <Image
                src={images[selectedImage]?.url || images[0]?.url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      selectedImage === i ? 'border-blue-600' : 'border-transparent'
                    }`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">{product.brand}</div>
              <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.review_count} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.compare_at_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">${product.compare_at_price.toFixed(2)}</span>
                  <span className="bg-red-100 text-red-700 text-sm font-bold px-2 py-1 rounded">-{discount}%</span>
                </>
              )}
            </div>

            <p className="text-muted-foreground">{product.short_description}</p>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-accent"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-accent"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddToCart} size="lg" className="flex-1 gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItem ? `In Cart (${cartItem.quantity})` : 'Add to Cart'}
                </Button>
                <Button variant="outline" size="lg" className="gap-2" onClick={handleToggleWishlist}>
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  {isInWishlist ? 'Saved' : 'Wishlist'}
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y">
              <div className="flex flex-col items-center gap-1 text-center">
                <Truck className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-medium">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <RotateCcw className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-medium">30 Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                {product.tags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.tags.map((tag) => (
                      <span key={tag} className="bg-accent px-3 py-1 rounded-full text-sm">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-4 text-muted-foreground">
                <p>Free standard shipping on all orders over $50. Estimated delivery 3-5 business days.</p>
                <p>Express shipping available for $15. Estimated delivery 1-2 business days.</p>
                <p>International shipping available to select countries. Rates calculated at checkout.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
