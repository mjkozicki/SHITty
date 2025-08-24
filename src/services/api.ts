import axios from 'axios';

const API_BASE_URL = 'http://localhost:1009/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  rating: number;
  image_url: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  updated: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: string;
  created: string;
  completed: string;
}

// API functions
export const apiService = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getTopProducts: async (limit: number = 5): Promise<Product[]> => {
    const response = await api.get(`/products/top?limit=${limit}`);
    return response.data;
  },

  // Search
  searchProducts: async (query: string, userId?: string): Promise<Product[]> => {
    const params = new URLSearchParams({ q: query });
    if (userId) params.append('user_id', userId);
    const response = await api.get(`/search?${params}`);
    return response.data;
  },

  // Cart
  addToCart: async (userId: string, item: CartItem): Promise<Cart> => {
    const response = await api.post(`/cart/add?user_id=${userId}`, item);
    return response.data;
  },

  removeFromCart: async (userId: string, item: CartItem): Promise<Cart> => {
    const response = await api.delete(`/cart/remove?user_id=${userId}`, item);
    return response.data;
  },

  getCart: async (userId: string): Promise<Cart> => {
    const response = await api.get(`/cart/${userId}`);
    return response.data;
  },

  // Checkout
  checkout: async (userId: string): Promise<Order> => {
    const response = await api.post(`/checkout?user_id=${userId}`);
    return response.data;
  },

  // Orders
  getOrderHistory: async (userId: string): Promise<Order[]> => {
    const response = await api.get(`/orders/${userId}`);
    return response.data;
  },

  // Recommendations
  getRecommendations: async (userId: string, limit: number = 5): Promise<Product[]> => {
    const response = await api.get(`/recommendations/${userId}?limit=${limit}`);
    return response.data;
  },
};

export default apiService;
