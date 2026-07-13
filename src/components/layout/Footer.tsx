import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold">Lumina</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Discover premium products with exceptional quality and style at Lumina.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=clothing" className="text-gray-400 hover:text-white transition-colors">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="text-gray-400 hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=home" className="text-gray-400 hover:text-white transition-colors">
                  Home & Living
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>support@lumina.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Subscribe to our newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Lumina. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
