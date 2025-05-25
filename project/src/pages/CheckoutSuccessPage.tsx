import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import Button from '../components/ui/Button';

const CheckoutSuccessPage: React.FC = () => {
  const { items } = useCartStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (items.length > 0) {
      navigate('/checkout');
    }
  }, [items, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-md mx-auto">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
          You will receive an email confirmation shortly.
        </p>
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Details</h2>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">ORD-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">Credit Card</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Shipping Method:</span>
              <span className="font-medium">Standard Shipping</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link to="/">
            <Button>Continue Shopping</Button>
          </Link>
          <Link to="/account">
            <Button variant="outline">View My Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;