import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import CheckoutForm from '../components/checkout/CheckoutForm';
import CartItem from '../components/cart/CartItem';

const CheckoutPage: React.FC = () => {
  const { user } = useAuthStore();
  const { items, totalPrice } = useCartStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/signin?redirect=checkout');
    }
    
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [user, items, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <CheckoutForm />
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="max-h-80 overflow-y-auto mb-4">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">${totalPrice().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900 font-medium">$5.99</span>
              </div>
              
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-600">Tax (7%)</span>
                <span className="text-gray-900 font-medium">${(totalPrice() * 0.07).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-base font-medium text-gray-900">Total</span>
                <span className="text-base font-bold text-indigo-600">
                  ${(totalPrice() + 5.99 + totalPrice() * 0.07).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;