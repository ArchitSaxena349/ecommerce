import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Stripe publishable key is missing. Please check your .env file.');
}

export const stripePromise = loadStripe(publishableKey);