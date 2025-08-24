import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { ShoppingCartIcon, HomeIcon, CubeIcon, ClockIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const cartContext = useContext(CartContext);
  const location = useLocation();
  
  if (!cartContext) {
    return null; // or a loading state
  }
  
  const { cart } = cartContext;
  
  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              aria-label="Go to homepage"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                SHITty
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" icon={<HomeIcon className="w-5 h-5" />} isActive={isActive('/')}>
                Home
              </NavLink>
              <NavLink to="/products" icon={<CubeIcon className="w-5 h-5" />} isActive={isActive('/products')}>
                Products
              </NavLink>
              <NavLink to="/orders" icon={<ClockIcon className="w-5 h-5" />} isActive={isActive('/orders')}>
                Orders
              </NavLink>
            </div>

            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="relative p-3 rounded-full bg-gradient-to-r from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 transition-all duration-300 group"
              aria-label={`View cart (${cartItemCount} items)`}
            >
              <ShoppingCartIcon className="w-6 h-6 text-primary-600 group-hover:text-primary-700 transition-colors duration-200" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

// NavLink component for consistent styling
interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, children, isActive }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
      isActive
        ? 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 shadow-md'
        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span>{children}</span>
  </Link>
);

export default Navbar;
