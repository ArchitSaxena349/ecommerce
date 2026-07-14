import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Minus, Plus, Star } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import Button from '../components/ui/Button';
import ProductGrid from '../components/product/ProductGrid';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchProductById, products, isLoading, error } = useProductStore();
  const { addItem, items, updateQuantity } = useCartStore();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const result = await fetchProductById(id);
        setProduct(result);
      };
      
      fetchProduct();
    }
  }, [id, fetchProductById]);
  
  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };
  
  const handleIncrement = () => {
    if (!product) return;

    if (quantityInCart > 0) {
      updateQuantity(product.id, quantityInCart + 1);
    } else {
      setQuantity(currentQuantity => currentQuantity + 1);
    }
  };

  const handleDecrement = () => {
    if (!product) return;

    if (quantityInCart > 0) {
      updateQuantity(product.id, quantityInCart - 1);
    } else {
      setQuantity(currentQuantity => Math.max(1, currentQuantity - 1));
    }
  };
  
  // Get related products (same category)
  const relatedProducts = products
    .filter(p => product && p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const quantityInCart = product ? items.find(item => item.product.id === product.id)?.quantity || 0 : 0;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 bg-gray-200 rounded-lg h-96"></div>
            <div className="md:w-1/2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Products</span>
      </Link>
      
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        
        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">(24 reviews)</span>
          </div>
          
          <p className="text-2xl font-bold text-indigo-600 mb-6">${product.price.toFixed(2)}</p>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
            {quantityInCart > 0 ? (
              <>
              <Link to="/cart" className="inline-flex h-10 items-center rounded-md bg-green-50 px-4 font-medium text-green-800 hover:bg-green-100">
                <ShoppingCart className="mr-2 h-5 w-5" />
                In cart: {quantityInCart} · View cart
              </Link>
              <div className="mt-3 flex w-fit items-center overflow-hidden rounded-md border border-indigo-600 text-indigo-600">
                <button type="button" onClick={handleDecrement} aria-label="Decrease quantity" className="p-2 transition-colors hover:bg-indigo-50">
                  <Minus className="h-5 w-5" />
                </button>
                <span className="min-w-10 border-x border-indigo-600 px-3 py-2 text-center font-semibold">{quantityInCart}</span>
                <button type="button" onClick={handleIncrement} aria-label="Increase quantity" className="p-2 transition-colors hover:bg-indigo-50">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              </>
            ) : (
              <div className="flex items-center">
                <div className="flex items-center overflow-hidden rounded-md border border-indigo-600 text-indigo-600">
                  <button type="button" onClick={handleDecrement} aria-label="Decrease quantity" className="p-2 transition-colors hover:bg-indigo-50">
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="min-w-10 border-x border-indigo-600 px-3 py-2 text-center font-semibold">{quantity}</span>
                  <button type="button" onClick={handleIncrement} aria-label="Increase quantity" className="p-2 transition-colors hover:bg-indigo-50">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <Button onClick={handleAddToCart} className="ml-4 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`pb-2 px-4 ${
                  activeTab === 'description'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`pb-2 px-4 ${
                  activeTab === 'details'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button
                className={`pb-2 px-4 ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </div>
            
            <div>
              {activeTab === 'description' && (
                <p className="text-gray-700">{product.description}</p>
              )}
              
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <p className="text-gray-700">
                    <span className="font-medium">Category:</span> {product.category}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">SKU:</span> {product.id.substring(0, 8).toUpperCase()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Availability:</span> In Stock
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Shipping:</span> Free shipping on orders over $50
                  </p>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <p className="text-gray-700 mb-4">This product has 24 reviews with an average rating of 5 stars.</p>
                  <Button variant="outline">Write a Review</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
