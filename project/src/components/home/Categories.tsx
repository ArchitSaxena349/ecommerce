import React from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../../store/productStore';

const Categories: React.FC = () => {
  const { categories } = useProductStore();
  
  // Sample category images - in a real app, these would come from your database
  const categoryImages = {
    clothing: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1600",
    electronics: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1600",
    home: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600",
    accessories: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600",
    beauty: "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=1600",
    sports: "https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=1600",
  };
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link 
              key={category}
              to={`/products?category=${category}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all group-hover:shadow-lg">
                <div className="h-40 overflow-hidden">
                  <img
                    src={categoryImages[category as keyof typeof categoryImages] || "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1600"}
                    alt={category}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-gray-900 font-medium capitalize">{category}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;