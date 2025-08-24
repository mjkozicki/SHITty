import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Product } from '../services/api';

interface CartState {
  items: CartItem[];
  total: number;
  userId: string;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: { items: CartItem[]; total: number } }
  | { type: 'SET_USER'; payload: string };

const initialState: CartState = {
  items: [],
  total: 0,
  userId: 'user123', // Default user ID for demo
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product_id === product.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: state.total + (product.price * quantity),
        };
      } else {
        return {
          ...state,
          items: [...state.items, { product_id: product.id, quantity }],
          total: state.total + (product.price * quantity),
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product_id === productId);
      
      if (!existingItem) return state;
      
      if (existingItem.quantity <= quantity) {
        const updatedItems = state.items.filter(item => item.product_id !== productId);
        const removedTotal = existingItem.quantity * (state.items.find(item => item.product_id === productId)?.quantity || 0);
        return {
          ...state,
          items: updatedItems,
          total: Math.max(0, state.total - removedTotal),
        };
      } else {
        const updatedItems = state.items.map(item =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity - quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: Math.max(0, state.total - (quantity * (state.items.find(item => item.product_id === productId)?.quantity || 0))),
        };
      }
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
      };
    
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
      };
    
    case 'SET_USER':
      return {
        ...state,
        userId: action.payload,
      };
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[], total: number) => void;
  setUser: (userId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeItem = (productId: string, quantity: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setCart = (items: CartItem[], total: number) => {
    dispatch({ type: 'SET_CART', payload: { items, total } });
  };

  const setUser = (userId: string) => {
    dispatch({ type: 'SET_USER', payload: userId });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, clearCart, setCart, setUser }}>
      {children}
    </CartContext.Provider>
  );
};
