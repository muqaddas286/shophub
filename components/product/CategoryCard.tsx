'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Category } from '@/types';
import { Laptop, Shirt, Home, Dumbbell, BookOpen, Sparkles } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  laptop: <Laptop className="w-8 h-8" />,
  shirt: <Shirt className="w-8 h-8" />,
  home: <Home className="w-8 h-8" />,
  dumbbell: <Dumbbell className="w-8 h-8" />,
  'book-open': <BookOpen className="w-8 h-8" />,
  sparkles: <Sparkles className="w-8 h-8" />,
};

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={`/shop/category/${category.slug}`}
        className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border hover:border-blue-500 hover:shadow-md transition-all group"
      >
        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          {iconMap[category.icon || ''] || <Sparkles className="w-8 h-8" />}
        </div>
        <span className="font-medium text-sm text-center">{category.name}</span>
      </Link>
    </motion.div>
  );
}
