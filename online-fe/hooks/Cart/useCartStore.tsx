import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductModels } from "@/models/product.model";

interface CartItem extends ProductModels {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: ProductModels, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.product_id === product.product_id,
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product_id === product.product_id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity }] });
        }
      },

      removeItem: (productId) =>
        set({
          items: get().items.filter((item) => item.product_id !== productId),
        }),

      updateQuantity: (productId, quantity) =>
        set({
          items: get().items.map((item) =>
            item.product_id === productId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        }),

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
    }),
    { name: "hplap-cart-v1" },
  ),
);
