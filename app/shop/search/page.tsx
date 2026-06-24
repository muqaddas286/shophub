'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchProducts } from '@/lib/db/products';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { Search } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (query) {
        const data = await searchProducts(query);
        setProducts(data);
      }
      setLoading(false);
    }
    load();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">
        Search Results for &quot;{query}&quot;
      </h1>
      <p className="text-muted-foreground mb-6">
        {products.length} {products.length === 1 ? 'product' : 'products'} found
      </p>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No products found for &quot;{query}&quot;</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
