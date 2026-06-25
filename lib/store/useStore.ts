import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, WishlistItem } from '@/types';

interface StoreState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: () => number;
  cartTotal: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      addToCart: (item) => {
        const existing = get().cart.find((c) => c.product_id === item.product_id);
        if (existing) {
          set({
            cart: get().cart.map((c) =>
              c.product_id === item.product_id
                ? { ...c, quantity: c.quantity + item.quantity }
                : c
            ),
          });
        } else {
          set({ cart: [...get().cart, item] });
        }
      },
      removeFromCart: (id) => {
        set({ cart: get().cart.filter((c) => c.id !== id) });
      },
      updateCartQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ cart: get().cart.filter((c) => c.id !== id) });
        } else {
          set({
            cart: get().cart.map((c) =>
              c.id === id ? { ...c, quantity } : c
            ),
          });
        }
      },
      clearCart: () => set({ cart: [] }),
      setCart: (items) => set({ cart: items }),
      addToWishlist: (item) => {
        if (!get().wishlist.find((w) => w.product_id === item.product_id)) {
          set({ wishlist: [...get().wishlist, item] });
        }
      },
      removeFromWishlist: (id) => {
        set({ wishlist: get().wishlist.filter((w) => w.id !== id) });
      },
      isInWishlist: (productId) => {
        return get().wishlist.some((w) => w.product_id === productId);
      },
      cartCount: () => get().cart.reduce((sum, c) => sum + c.quantity, 0),
      cartTotal: () =>
        get().cart.reduce(
          (sum, c) => sum + (c.product?.price || 0) * c.quantity,
          0
        ),
    }),
    {
      name: 'shophub-store',
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }),
    }
  )
);
