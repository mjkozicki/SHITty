import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { CartContext } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const cartContext = useContext(CartContext);
  
  if (!cartContext) {
    return null; // or a loading state
  }
  
  const { cart, updateQuantity, removeItem } = cartContext;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet. 
              Start shopping to discover amazing products!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ShoppingBagIcon className="w-6 h-6 mr-2" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shopping Cart
          </h1>
          <p className="text-xl text-gray-600">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  Cart Items ({cart.items.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cart.items.map((item) => (
                  <CartItem
                    key={item.product_id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-gradient-to-r from-success-500 to-success-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-success-600 hover:to-success-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                Proceed to Checkout
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <div className="mt-6 text-center">
                <Link
                  to="/products"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Item Component
interface CartItemProps {
  item: {
    product_id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      image_url: string;
      stock: number;
    };
  };
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  const maxQuantity = Math.min(item.product.stock, 99);

  return (
    <div className="p-6 flex items-center space-x-4">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.product.image_url}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded-xl"
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {item.product.name}
        </h3>
        <p className="text-2xl font-bold text-primary-600">
          ${item.product.price.toFixed(2)}
        </p>
        {item.product.stock < 10 && (
          <p className="text-sm text-red-600 font-medium">
            Only {item.product.stock} left in stock
          </p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onQuantityChange(item.product_id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Decrease quantity"
        >
          <MinusIcon className="w-4 h-4 text-gray-600" />
        </button>
        
        <span className="w-12 text-center font-semibold text-gray-900">
          {item.quantity}
        </span>
        
        <button
          onClick={() => onQuantityChange(item.product_id, item.quantity + 1)}
          disabled={item.quantity >= maxQuantity}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Increase quantity"
        >
          <PlusIcon className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">
          ${(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.product_id)}
        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors duration-200"
        aria-label={`Remove ${item.product.name} from cart`}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Cart;
