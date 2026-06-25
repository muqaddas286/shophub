'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store/useStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { toast } = useToast();
  const cart = useStore((s) => s.cart);
  const updateCartQuantity = useStore((s) => s.updateCartQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const clearCart = useStore((s) => s.clearCart);

  const handleUpdateQuantity = (id: string, qty: number) => {
    updateCartQuantity(id, qty);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
    toast({ title: 'Item removed' });
  };

  const subtotal = cart.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you have not added anything yet.</p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-4 p-4 rounded-xl border bg-card"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0 relative">
                  <Image
                    src={item.product?.images?.[0]?.url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={item.product?.name || ''}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/product/${item.product?.slug}`} className="font-medium hover:text-blue-600 line-clamp-1">
                    {item.product?.name}
                  </Link>
                  <div className="text-sm text-muted-foreground mt-1">${item.product?.price.toFixed(2)}</div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-accent"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-accent"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right font-semibold shrink-0">
                  ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <Button variant="ghost" onClick={clearCart} className="text-red-500">
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button asChild className="w-full mt-6 gap-2" size="lg">
              <Link href="/shop/checkout">
                Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
