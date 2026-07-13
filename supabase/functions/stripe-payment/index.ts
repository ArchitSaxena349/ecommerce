import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'npm:stripe@13.11.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

interface CheckoutItem {
  product?: {
    id?: string;
  };
  quantity?: number;
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') || '';

const SHIPPING_FEE = 5.99;
const TAX_RATE = 0.07;

const corsHeaders = (requestOrigin: string | null) => ({
  // ALLOWED_ORIGIN should be set in production. Falling back to the requesting
  // origin keeps preview and local deployments functional until it is configured.
  'Access-Control-Allow-Origin': allowedOrigin || requestOrigin || 'null',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
  Vary: 'Origin',
});

const getAuthToken = (authHeader: string | null): string | null => {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
};

serve(async (req: Request) => {
  const requestOrigin = req.headers.get('origin');
  const headers = corsHeaders(requestOrigin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  try {
    if (allowedOrigin && requestOrigin && requestOrigin !== allowedOrigin) {
      throw new Error('Origin not allowed');
    }

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new Error('Supabase environment variables are not configured');
    }

    const token = getAuthToken(req.headers.get('Authorization'));
    if (!token) {
      throw new Error('Missing bearer token');
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { items, shippingDetails } = (await req.json()) as {
      items?: CheckoutItem[];
      userId?: string;
      shippingDetails?: unknown;
    };

    if (!Array.isArray(items) || items.length === 0 || !shippingDetails) {
      throw new Error('Missing required fields');
    }

    const normalizedItems = items.map(item => ({
      productId: item.product?.id,
      quantity: Number(item.quantity || 0),
    }));

    if (normalizedItems.some(item => !item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
      throw new Error('Invalid line items');
    }

    const productIds = [...new Set(normalizedItems.map(item => item.productId as string))];
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, price')
      .in('id', productIds);

    if (productsError) {
      throw new Error('Failed to load product pricing');
    }

    const productPriceMap = new Map<string, number>();
    (products || []).forEach(product => {
      productPriceMap.set(product.id, Number(product.price));
    });

    if (productPriceMap.size !== productIds.length) {
      throw new Error('One or more products are invalid');
    }

    const subtotal = normalizedItems.reduce((acc, item) => {
      const unitPrice = productPriceMap.get(item.productId as string) || 0;
      return acc + unitPrice * item.quantity;
    }, 0);
    const total = Number((subtotal + SHIPPING_FEE + subtotal * TAX_RATE).toFixed(2));

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        total,
      })
      .select('id')
      .single();

    if (orderError || !order) {
      throw new Error('Failed to create order');
    }

    const orderItemsPayload = normalizedItems.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: productPriceMap.get(item.productId as string) || 0,
    }));

    const { error: orderItemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsPayload);

    if (orderItemsError) {
      throw new Error('Failed to create order items');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'usd',
      metadata: {
        userId: user.id,
        orderId: order.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
      }),
      {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
});
