import React from 'react';
import { ShoppingBag, Truck, CreditCard, LifeBuoy } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="About us hero"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Founded in 2020, Lumina has grown from a small startup to a trusted e-commerce destination. 
              We're passionate about bringing quality products to customers worldwide.
            </p>
          </div>
        </div>
      </div>
      
      {/* Mission Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-8">
              At Lumina, our mission is to provide exceptional products that enhance your everyday life. 
              We believe in quality, affordability, and outstanding customer service. 
              Every product in our catalog is carefully selected to ensure it meets our high standards.
            </p>
            <div className="flex justify-center">
              <ShoppingBag className="h-16 w-16 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-indigo-100 rounded-full mb-6">
                <Truck className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reliability</h3>
              <p className="text-gray-700">
                We deliver on our promises. From accurate product descriptions to on-time shipping, 
                you can count on us every step of the way.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-indigo-100 rounded-full mb-6">
                <CreditCard className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-700">
                We believe in clear communication and fair pricing. No hidden fees or misleading information—just 
                straightforward shopping.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-indigo-100 rounded-full mb-6">
                <LifeBuoy className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Focus</h3>
              <p className="text-gray-700">
                Your satisfaction is our priority. We're committed to providing exceptional service and 
                support whenever you need it.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                name: 'Alex Johnson',
                role: 'Founder & CEO',
                image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1600',
              },
              {
                name: 'Sarah Williams',
                role: 'Head of Product',
                image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600',
              },
              {
                name: 'David Chen',
                role: 'CTO',
                image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1600',
              },
              {
                name: 'Maria Rodriguez',
                role: 'Customer Experience',
                image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1600',
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;