import React, { useEffect } from 'react';
import { useProductStore } from '../store/productStore';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Categories from '../components/home/Categories';
import Testimonials from '../components/home/Testimonials';

const HomePage: React.FC = () => {
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <Testimonials />
    </div>
  );
};

export default HomePage;