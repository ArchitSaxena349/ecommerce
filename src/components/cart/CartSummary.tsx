import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';

const CartSummary: React.FC = () => {
  const { items, totalPrice } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = totalPrice();
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) {
      navigate('/signin?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
          <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900 font-medium">${shipping.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (7%)</span>
          <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-base font-medium text-gray-900">Total</span>
            <span className="text-base font-bold text-indigo-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleCheckout}
        fullWidth 
        className="mt-6"
        disabled={items.length === 0}
      >
        {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
      </Button>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Secure checkout powered by Stripe</p>
        <p className="mt-1">Free shipping on orders over $50</p>
      </div>
    </div>
  );
};

export default CartSummary;