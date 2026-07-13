import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Hero background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Discover Quality Products for Modern Living
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Explore our curated collection of premium products designed to enhance your lifestyle. From fashion to electronics, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/products">
              <Button size="lg">Shop Now</Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;