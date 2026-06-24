'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Truck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, Category } from '@/types';
import { getFeaturedProducts, getBestSellers, getCategories } from '@/lib/db/products';
import ProductCard from '@/components/product/ProductCard';
import ProductCarousel from '@/components/product/ProductCarousel';
import CategoryCard from '@/components/product/CategoryCard';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [f, b, c] = await Promise.all([
        getFeaturedProducts(),
        getBestSellers(),
        getCategories(),
      ]);
      setFeatured(f);
      setBestSellers(b);
      setCategories(c);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-16 sm:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium mb-4">
                New Collection 2026
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Discover Premium Products for Every Lifestyle
              </h1>
              <p className="text-lg text-blue-100 mb-8 max-w-lg">
                Shop the latest trends in electronics, fashion, home decor, and more. Quality guaranteed with fast shipping.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                  <Link href="/shop">Shop Now <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                  <Link href="/shop/category/electronics">Explore Electronics</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Shopping"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, label: 'Free Shipping', desc: 'On orders over $50' },
              { icon: Shield, label: 'Secure Payment', desc: '100% protected' },
              { icon: RotateCcw, label: 'Easy Returns', desc: '30 day policy' },
              { icon: Headphones, label: '24/7 Support', desc: 'Always here to help' },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-sm">{feature.label}</div>
                  <div className="text-xs text-muted-foreground">{feature.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Link href="/shop" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {categories.map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/shop" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers Carousel */}
      {bestSellers.length > 0 && (
        <ProductCarousel products={bestSellers} title="Best Sellers" />
      )}

      {/* Promo Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="p-8 sm:p-12">
                <span className="inline-block bg-blue-600 px-3 py-1 rounded-full text-xs font-bold mb-4">
                  LIMITED TIME
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Summer Sale Up to 50% Off</h2>
                <p className="text-slate-300 mb-6">Grab the best deals on electronics, fashion, and home essentials before they are gone.</p>
                <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  <Link href="/shop">Shop the Sale</Link>
                </Button>
              </div>
              <div className="hidden md:block relative h-80">
                <Image
                  src="https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Sale"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <Zap className="w-10 h-10 mx-auto text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Stay in the Loop</h2>
          <p className="text-muted-foreground mb-6">Subscribe for exclusive deals, new arrivals, and insider tips.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function RotateCcw(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
