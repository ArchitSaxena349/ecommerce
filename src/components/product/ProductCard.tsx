import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import Button from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items, updateQuantity } = useCartStore();
  const quantityInCart = items.find(item => item.product.id === product.id)?.quantity ?? 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleQuantityChange = (e: React.MouseEvent, quantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity);
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
            {quantityInCart > 0 ? (
              <div className="flex items-center overflow-hidden rounded-md border border-indigo-600 text-indigo-600">
                <button
                  type="button"
                  onClick={(e) => handleQuantityChange(e, quantityInCart - 1)}
                  aria-label="Decrease quantity"
                  className="p-2 transition-colors hover:bg-indigo-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 border-x border-indigo-600 px-2 py-1 text-center text-sm font-semibold">
                  {quantityInCart}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleQuantityChange(e, quantityInCart + 1)}
                  aria-label="Increase quantity"
                  className="p-2 transition-colors hover:bg-indigo-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddToCart}
                className="flex items-center space-x-1"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
