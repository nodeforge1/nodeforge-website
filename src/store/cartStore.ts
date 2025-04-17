import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, NodeConfig } from '../types';
import { calculateTotalPrice } from '../utils/calculateTotalPrice';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, config: NodeConfig) => void;
  removeItem: (itemId: string) => void;
  incrementQuantity: (itemId: string) => void;
  decrementQuantity: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Add new item or increment existing item
      addItem: (product, config) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.id === product.id &&
              JSON.stringify(item.config) === JSON.stringify(config)
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item === existingItem
                  ? { 
                      ...item, 
                      quantity: item.quantity + 1,
                      totalPrice: calculateTotalPrice(product as any, config) * (item.quantity + 1)
                    }
                  : item
              ),
            };
          }

          // const price = calculatePrice(product.basePrice, config);
          const price = calculateTotalPrice(product as any, config);
          return {
            items: [
              ...state.items,
              {
                ...product,
                config,
                quantity: 1,
                totalPrice: price,
              },
            ],
          };
        });
      },

      // Remove item completely from cart
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      // Increase quantity by 1
      incrementQuantity: (itemId) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === itemId) {
              const newQuantity = item.quantity + 1;
              return {
                ...item,
                quantity: newQuantity,
                totalPrice: calculateTotalPrice(item as any, item.config) * newQuantity
              };
            }
            return item;
          }),
        }));
      },

      // Decrease quantity by 1 (removes if quantity reaches 0)
      decrementQuantity: (itemId) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id === itemId) {
                const newQuantity = item.quantity - 1;
                return {
                  ...item,
                  quantity: newQuantity,
                  totalPrice: calculateTotalPrice(item as any, item.config) * newQuantity
                };
              }
              return item;
            })
            .filter((item) => item.quantity > 0), // Remove if quantity reaches 0
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'nodeforge-cart-storage',
      // Optional: Only persist the items array
      partialize: (state) => ({ items: state.items }),
    }
  )
);