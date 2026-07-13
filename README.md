# Lumina E-commerce

Lumina is a React storefront with product browsing, cart management, checkout, order history, saved addresses, Supabase authentication, and Stripe payments.

## Requirements

- Node.js 18 or later
- npm
- A Supabase project and Stripe publishable key for live payments (optional for mock mode)

## Run locally

All application files now live in this repository root.

```bash
npm install
npm run dev
```

Vite prints the local address, normally `http://localhost:5173`.

## Available commands

```bash
npm run dev      # Start the development server
npm run build    # Create a production build in dist/
npm run preview  # Serve the production build locally
npm run lint     # Run ESLint
```

## Environment variables

Copy `.env.example` to `.env` and provide the values for your environment:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

When Supabase is not configured, the app uses its local mock data layer so the storefront can still be explored.

## Project layout

```text
src/                 React application
supabase/functions/  Stripe Edge Function
supabase/migrations/ Database migrations
```

## Payments and orders

For a real Stripe checkout flow, deploy the `supabase/functions/stripe-payment` Edge Function and configure its Stripe and Supabase environment variables. Apply the migrations in `supabase/migrations` to create the order tables and access policies.
