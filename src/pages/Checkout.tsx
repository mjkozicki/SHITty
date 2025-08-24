import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';
import { apiService } from '../services/api';

const Checkout: React.FC = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleCheckout = async () => {
    if (state.items.length === 0) return;

    setIsProcessing(true);
    try {
      await apiService.checkout(state.userId);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="text-center py-12">
        <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Complete!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been successfully processed.</p>
        <button
          onClick={() => navigate('/orders')}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors mr-4"
        >
          View Orders
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add some products to your cart before checking out.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            {state.items.map((item) => (
              <div key={item.product_id} className="flex justify-between items-center">
                <span className="text-gray-600">Item {item.product_id}</span>
                <span className="font-medium">Qty: {item.quantity}</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary-600">${state.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Complete Order</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 mb-4">
              Click the button below to complete your order. This will process your payment and create your order.
            </p>
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : `Complete Order - $${state.total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
