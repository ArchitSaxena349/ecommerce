import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CheckoutReceipt, Product } from '../types';

interface CartState {
  items: CartItem[];
  lastCompletedOrder: CheckoutReceipt | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  completeOrder: (receipt: CheckoutReceipt) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastCompletedOrder: null,
      
      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.id === product.id);
        
        if (existingItem) {
          set({
            items: items.map(item => 
              item.product.id === product.id 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            lastCompletedOrder: null,
          });
        } else {
          set({ items: [...items, { product, quantity }], lastCompletedOrder: null });
        }
      },
      
      removeItem: (productId) => {
        const { items } = get();
        set({ items: items.filter(item => item.product.id !== productId) });
      },
      
      updateQuantity: (productId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          set({ items: items.filter(item => item.product.id !== productId) });
        } else {
          set({
            items: items.map(item => 
              item.product.id === productId 
                ? { ...item, quantity }
                : item
            )
          });
        }
      },
      
      clearCart: () => set({ items: [] }),

      completeOrder: (receipt) => set({ items: [], lastCompletedOrder: receipt }),
      
      totalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      totalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
