import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.warn('Stripe publishable key is missing. Stripe checkout is disabled.');
}

export const stripePromise = publishableKey ? loadStripe(publishableKey) : Promise.resolve(null);
