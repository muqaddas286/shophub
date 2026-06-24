'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductsByCategory, getCategories } from '@/lib/db/products';
import { Product, Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { ChevronRight } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [p, c] = await Promise.all([
        getProductsByCategory(slug),
        getCategories(),
      ]);
      setProducts(p);
      setCategory(c.find((cat) => cat.slug === slug) || null);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-foreground">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{category?.name || slug}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">{category?.name || 'Category'}</h1>
        <p className="text-muted-foreground mb-6">{category?.description}</p>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
