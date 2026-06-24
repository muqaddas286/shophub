'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

export default function ProductCarousel({ products, title }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, i) => (
            <div key={product.id} className="snap-start shrink-0 w-[260px] sm:w-[280px]">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
