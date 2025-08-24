import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StarIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { apiService, Product } from '../services/api';
import { useCart } from '../contexts/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        const productData = await apiService.getProduct(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link
          to="/products"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Product+Image';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="text-gray-600">{product.rating}</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">{product.category}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">Stock: {product.stock}</span>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="text-4xl font-bold text-primary-600">${product.price}</div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 h-10 border border-gray-300 rounded-md text-center"
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-primary-600 text-white py-4 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? 'Out of Stock' : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
          </button>

          {/* Additional Info */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rating:</span>
              <span className="font-medium">{product.rating}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stock:</span>
              <span className="font-medium">{product.stock} units</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
