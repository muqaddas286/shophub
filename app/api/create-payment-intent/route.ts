import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY || '';
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2026-05-27.dahlia',
    });
    const { amount, currency = 'usd' } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
