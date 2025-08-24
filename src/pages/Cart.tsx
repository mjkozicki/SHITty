import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';
import { apiService, Product } from '../services/api';

const Cart: React.FC = () => {
  const { state, removeItem, clearCart } = useCart();
  const [cartProducts, setCartProducts] = useState<(Product & { quantity: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCartProducts = async () => {
      if (state.items.length === 0) {
        setCartProducts([]);
        setLoading(false);
        return;
      }

      try {
        const products = await Promise.all(
          state.items.map(async (item) => {
            const product = await apiService.getProduct(item.product_id);
            return { ...product, quantity: item.quantity };
          })
        );
        setCartProducts(products);
      } catch (error) {
        console.error('Error loading cart products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCartProducts();
  }, [state.items]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId, 1);
    } else {
      const currentItem = state.items.find(item => item.product_id === productId);
      if (currentItem) {
        const difference = newQuantity - currentItem.quantity;
        if (difference > 0) {
          // Add more items
          const product = cartProducts.find(p => p.id === productId);
          if (product) {
            // This would need to be implemented in the cart context
            // For now, we'll just remove and add
            removeItem(productId, currentItem.quantity);
            // Note: This is a simplified approach
          }
        } else {
          // Remove items
          removeItem(productId, Math.abs(difference));
        }
      }
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Link
          to="/products"
          className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors inline-block"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-md"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/80x80?text=Product';
                }}
              />
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.category}</p>
                <p className="text-primary-600 font-bold">${product.price}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{product.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">${(product.price * product.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(product.id, product.quantity)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-lg font-bold text-primary-600">${state.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={state.items.length === 0}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
            
            <button
              onClick={clearCart}
              className="w-full mt-3 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
