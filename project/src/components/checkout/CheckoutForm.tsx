import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { stripePromise } from '../../lib/stripe';
import { calculateOrderTotal } from '../../lib/pricing';
import Button from '../ui/Button';
import Input from '../ui/Input';

const CheckoutForm: React.FC = () => {
  const { user } = useAuthStore();
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Check if we have valid Supabase config
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const subtotal = totalPrice();
      const orderTotal = calculateOrderTotal(subtotal);

      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('tlmwhzxaoflkczolztrg')) {
        // MOCK MODE: Simulate network delay and success
        console.warn('Mock mode: simulating successful payment');

        // SAVE MOCK ORDER
        try {
          const { supabase } = await import('../../lib/supabase');

          const orderInsertResult = await supabase.from('orders').insert({
            user_id: user?.id || 'guest',
            total: orderTotal,
            status: 'completed',
          });

          if (orderInsertResult.error) {
            throw orderInsertResult.error;
          }

          const orderId = orderInsertResult.data?.id;
          if (orderId) {
            await supabase.from('order_items').insert(
              items.map(item => ({
                order_id: orderId,
                product_id: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
              }))
            );
          }
        } catch (err) {
          console.error('Failed to save mock order:', err);
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
        clearCart();
        navigate('/checkout/success');
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Create payment intent
      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          items,
          userId: user?.id,
          shippingDetails: formData,
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || 'Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error('Missing payment client secret');
      }

      // Confirm payment with Stripe's hosted payment page
      const { error: stripeError } = await stripe.confirmPayment({
        clientSecret,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      });

      if (stripeError) throw stripeError;

      // Clear cart and redirect on success
      clearCart();
      navigate('/checkout/success');
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ form: 'Payment processing failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some products to your cart before checking out.</p>
        <Button onClick={() => navigate('/products')}>Browse Products</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            fullWidth
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            fullWidth
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
        <div className="space-y-4">
          <Input
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            fullWidth
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              fullWidth
            />
            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
              fullWidth
            />
            <Input
              label="ZIP Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              error={errors.zipCode}
              fullWidth
            />
          </div>
        </div>
      </div>

      {errors.form && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {errors.form}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div>
          <p className="text-lg font-bold text-gray-900">
            Total: ${calculateOrderTotal(totalPrice()).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">Including taxes and shipping</p>
        </div>
        <Button type="submit" isLoading={isLoading}>
          Complete Order
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
