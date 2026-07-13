import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    closeMenu();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Lumina</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">
              About
            </Link>
            <Link to="/orders" className="text-gray-700 hover:text-indigo-600 transition-colors">
              My Orders
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 text-gray-700"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <User className="h-6 w-6" />
                  <span className="text-sm">{user.full_name || user.email}</span>
                </button>
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <Link 
                      to="/account" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/signin">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-700"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={closeMenu}
              >
                Products
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link 
                to="/cart" 
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={closeMenu}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({totalItems()})</span>
              </Link>
              <Link 
                to="/orders" 
                className="text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={closeMenu}
              >
                My Orders
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/account" 
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                    onClick={closeMenu}
                  >
                    My Account
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="text-left text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/signin" onClick={closeMenu}>
                    <Button variant="outline" fullWidth>Sign In</Button>
                  </Link>
                  <Link to="/signup" onClick={closeMenu}>
                    <Button fullWidth>Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
