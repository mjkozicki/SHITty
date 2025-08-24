import React, { useState, useEffect } from 'react';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { apiService, Order } from '../services/api';
import { useCart } from '../contexts/CartContext';

const Orders: React.FC = () => {
  const { cart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const orderHistory = await apiService.getOrderHistory(cart.userId);
        setOrders(orderHistory);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [cart.userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ClockIcon className="w-24 h-24 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h1>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your order history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Order #{order.id.slice(-8)}</h3>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.created).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {order.status}
                </span>
                <p className="text-2xl font-bold text-primary-600 mt-1">${order.total.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-800 mb-2">Items:</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm text-gray-600">
                    <span>Item {item.product_id}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {order.completed && (
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-500">
                  Completed on {new Date(order.completed).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
