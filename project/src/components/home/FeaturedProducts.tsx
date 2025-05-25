import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import ProductGrid from '../product/ProductGrid';

const FeaturedProducts: React.FC = () => {
  const { featuredProducts, isLoading } = useProductStore();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        <Link 
          to="/products" 
          className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <ProductGrid products={featuredProducts.slice(0, 4)} />
    </div>
  );
};

export default FeaturedProducts;