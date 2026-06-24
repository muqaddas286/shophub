'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CartItem, Address } from '@/types';
import { getCartItems } from '@/lib/db/cart';
import { getAddresses } from '@/lib/db/orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/db/supabase';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function PaymentForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });
    setProcessing(false);
    if (error) {
      toast({ title: error.message || 'Payment failed', variant: 'destructive' });
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={processing || !stripe} className="w-full">
        {processing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    async function load() {
      try {
        const [cartData, addrData] = await Promise.all([getCartItems(), getAddresses()]);
        setItems(cartData);
        setAddresses(addrData);
        if (addrData.length > 0) {
          const def = addrData.find((a) => a.is_default);
          setSelectedAddress(def?.id || addrData[0].id);
        }
      } catch {
        toast({ title: 'Please sign in to checkout', variant: 'destructive' });
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router, toast]);

  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  const initializePayment = async () => {
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch {
      toast({ title: 'Error initializing payment', variant: 'destructive' });
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({ title: 'Please select a shipping address', variant: 'destructive' });
      return;
    }
    setProcessing(true);
    try {
      const address = addresses.find((a) => a.id === selectedAddress);
      if (!address) throw new Error('Address not found');

      const orderItems = items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product?.name || '',
        product_image: item.product?.images?.[0]?.url || null,
        quantity: item.quantity,
        unit_price: item.product?.price || 0,
        total_price: (item.product?.price || 0) * item.quantity,
      }));

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          total_amount: total,
          shipping_address: address,
          billing_address: address,
          status: 'pending',
          payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
        })
        .select()
        .single();

      if (error) throw error;

      const orderItemsData = orderItems.map((item) => ({
        ...item,
        order_id: order.id,
      }));
      await supabase.from('order_items').insert(orderItemsData);
      await supabase.from('cart_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      toast({ title: 'Order placed successfully!' });
      router.push('/dashboard/orders');
    } catch {
      toast({ title: 'Error placing order', variant: 'destructive' });
    } finally {
      setProcessing(false);
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
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/shop/cart"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Cart</Link>
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-muted'}`}>1</div>
          <span className="hidden sm:inline font-medium">Shipping</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-muted'}`}>2</div>
          <span className="hidden sm:inline font-medium">Payment</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-muted'}`}>3</div>
          <span className="hidden sm:inline font-medium">Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl border bg-card p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" /> Shipping Address
                </h2>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No addresses saved.</p>
                    <Button asChild>
                      <Link href="/dashboard/addresses">Add Address</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedAddress === addr.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'hover:bg-accent'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-1"
                        />
                        <div className="text-sm">
                          <div className="font-medium">{addr.full_name}</div>
                          <div className="text-muted-foreground">{addr.address_line1}</div>
                          {addr.address_line2 && <div className="text-muted-foreground">{addr.address_line2}</div>}
                          <div className="text-muted-foreground">
                            {addr.city}, {addr.state} {addr.postal_code}
                          </div>
                          {addr.is_default && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-1 inline-block">Default</span>}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                <Button onClick={() => setStep(2)} className="mt-4" disabled={!selectedAddress}>
                  Continue to Payment
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl border bg-card p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Payment Method
                </h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'hover:bg-accent'}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                    <span className="font-medium">Credit / Debit Card (Stripe)</span>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'hover:bg-accent'}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                    <span className="font-medium">Cash on Delivery</span>
                  </label>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => { setStep(3); if (paymentMethod === 'card') initializePayment(); }}>Continue to Review</Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl border bg-card p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5" /> Review Order
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">{item.product?.name}</span>
                        <span className="text-muted-foreground"> x {item.quantity}</span>
                      </div>
                      <span>${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {paymentMethod === 'card' && clientSecret && (
                  <div className="mt-6">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <PaymentForm clientSecret={clientSecret} onSuccess={handlePlaceOrder} />
                    </Elements>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <Button onClick={handlePlaceOrder} disabled={processing} className="flex-1">
                      {processing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
