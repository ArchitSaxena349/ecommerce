import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import Button from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          {product.featured && (
            <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{product.name}</h3>
            <span className="font-bold text-indigo-600">${product.price.toFixed(2)}</span>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
              {product.category}
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              className="flex items-center space-x-1"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;