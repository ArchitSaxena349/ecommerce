import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import ProductGrid from '../components/product/ProductGrid';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ProductsPage: React.FC = () => {
  const { products, categories, fetchProducts, isLoading } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const categoryParam = searchParams.get('category');
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm) {
      searchParams.set('search', searchTerm);
    } else {
      searchParams.delete('search');
    }
    
    setSearchParams(searchParams);
  };
  
  const handleCategoryClick = (category: string) => {
    if (categoryParam === category) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    
    setSearchParams(searchParams);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchParams.get('search') || 
      product.name.toLowerCase().includes(searchParams.get('search')!.toLowerCase()) ||
      product.description.toLowerCase().includes(searchParams.get('search')!.toLowerCase());
    
    const matchesCategory = !categoryParam || product.category === categoryParam;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Sidebar / Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="md:hidden mb-4">
            <Button 
              variant="outline" 
              onClick={toggleFilters}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
          
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                    categoryParam === category
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                className="rounded-r-none"
              />
              <Button type="submit" className="rounded-l-none">
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
                ))}
              </div>
            </div>
          ) : (
            <ProductGrid 
              products={filteredProducts} 
              title={categoryParam 
                ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} Products` 
                : 'All Products'
              } 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;