import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  COUPONS,
  DELIVERY_FEE_MORA,
  INITIAL_ORDERS,
  INITIAL_PROFILE,
} from '../data/dishes';
import { teyvatAudio } from '../lib/audio';
import {
  CartItem,
  DeliveryPoint,
  Dish,
  Order,
  OrderStatus,
  PaymentMethod,
  StackRoute,
  TabId,
  TravelerProfile,
} from '../types';

interface PlaceOrderInput {
  deliveryPoint: DeliveryPoint;
  paymentMethod: PaymentMethod;
  kitchenNotes: string;
}

interface DelicaciesState {
  // Navigation & Entrance
  hasEntered: boolean;
  activeTab: TabId;
  stack: StackRoute[];

  // Audio Controls
  bgmEnabled: boolean;
  sfxEnabled: boolean;

  // Cart & Coupons
  cart: CartItem[];
  appliedCouponCode: string | null;

  // Favorites, Profile & Orders
  favoriteIds: number[];
  profile: TravelerProfile;
  orders: Order[];

  // Toast Feedback
  toastMessage: string | null;

  // Actions
  enterTeyvat: (withBgm?: boolean) => void;
  setActiveTab: (tab: TabId) => void;
  pushStack: (route: StackRoute) => void;
  popStack: () => void;
  resetToTab: (tab: TabId) => void;

  toggleBgm: () => void;
  toggleSfx: () => void;

  addToCart: (dish: Dish, quantity?: number) => void;
  removeFromCart: (dishId: number) => void;
  updateQuantity: (dishId: number, quantity: number) => void;
  clearCart: () => void;

  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;

  toggleFavorite: (dishId: number) => void;
  topUpMora: (amount: number) => void;

  placeOrder: (input: PlaceOrderInput) => { ok: boolean; order?: Order; error?: string };
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reorderFromHistory: (orderId: string) => void;

  showToast: (message: string) => void;
  clearToast: () => void;

  // Derived helpers
  getCartTotals: () => {
    itemCount: number;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    finalTotal: number;
  };
}

let toastTimer: number | null = null;

export const useDelicaciesStore = create<DelicaciesState>()(
  persist(
    (set, get) => ({
      hasEntered: false,
      activeTab: 'catalog',
      stack: [],

      bgmEnabled: false,
      sfxEnabled: true,

      cart: [],
      appliedCouponCode: null,

      favoriteIds: [5101, 4102, 3107],
      profile: INITIAL_PROFILE,
      orders: INITIAL_ORDERS,

      toastMessage: null,

      enterTeyvat: (withBgm = true) => {
        if (withBgm) {
          teyvatAudio.setBgmEnabled(true);
        }
        teyvatAudio.playSfx('epic', get().sfxEnabled);
        set({
          hasEntered: true,
          bgmEnabled: withBgm,
          activeTab: 'catalog',
          stack: [],
        });
      },

      setActiveTab: (tab) => {
        set({ activeTab: tab, stack: [] });
      },

      pushStack: (route) => {
        set((state) => ({ stack: [...state.stack, route] }));
      },

      popStack: () => {
        set((state) => ({ stack: state.stack.slice(0, -1) }));
      },

      resetToTab: (tab) => {
        set({ activeTab: tab, stack: [] });
      },

      toggleBgm: () => {
        const next = !get().bgmEnabled;
        teyvatAudio.setBgmEnabled(next);
        set({ bgmEnabled: next });
        get().showToast(next ? 'Musik latar Teyvat diaktifkan' : 'Musik latar dijeda');
      },

      toggleSfx: () => {
        const next = !get().sfxEnabled;
        set({ sfxEnabled: next });
        get().showToast(next ? 'Efek suara diaktifkan' : 'Efek suara dinonaktifkan');
      },

      addToCart: (dish, quantity = 1) => {
        const safeQty = Math.max(1, Math.min(99, quantity));
        set((state) => {
          const existing = state.cart.find((item) => item.dish.id === dish.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.dish.id === dish.id
                  ? { ...item, quantity: Math.min(99, item.quantity + safeQty) }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, { dish, quantity: safeQty }],
          };
        });

        if (dish.rarity === 5) {
          teyvatAudio.playSfx('legendary', get().sfxEnabled);
        } else if (dish.rarity === 4) {
          teyvatAudio.playSfx('epic', get().sfxEnabled);
        }

        get().showToast(`${dish.name} (x${safeQty}) masuk ke Tas Petualang`);
      },

      removeFromCart: (dishId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.dish.id !== dishId),
        }));
      },

      updateQuantity: (dishId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(dishId);
          return;
        }
        const safeQty = Math.min(99, quantity);
        set((state) => ({
          cart: state.cart.map((item) =>
            item.dish.id === dishId ? { ...item, quantity: safeQty } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [], appliedCouponCode: null });
      },

      applyCoupon: (rawCode) => {
        const normalized = rawCode.trim().toUpperCase();
        if (!normalized) {
          return { ok: false, message: 'Masukkan kode kupon terlebih dahulu.' };
        }
        const coupon = COUPONS.find((c) => c.code === normalized);
        if (!coupon) {
          return {
            ok: false,
            message: 'Kode kupon tidak dikenali. Coba PAIMONKENYANG atau FRAGILERESIN.',
          };
        }
        set({ appliedCouponCode: coupon.code });
        teyvatAudio.playSfx('epic', get().sfxEnabled);
        get().showToast(`Kupon ${coupon.code} berhasil diterapkan`);
        return { ok: true, message: `${coupon.title} aktif.` };
      },

      removeCoupon: () => {
        set({ appliedCouponCode: null });
        get().showToast('Kupon dilepas dari pesanan');
      },

      toggleFavorite: (dishId) => {
        const exists = get().favoriteIds.includes(dishId);
        set((state) => ({
          favoriteIds: exists
            ? state.favoriteIds.filter((id) => id !== dishId)
            : [...state.favoriteIds, dishId],
        }));
        get().showToast(
          exists ? 'Dihapus dari daftar favorit' : 'Disimpan ke koleksi favorit'
        );
      },

      topUpMora: (amount) => {
        set((state) => ({
          profile: {
            ...state.profile,
            moraBalance: state.profile.moraBalance + amount,
          },
        }));
        teyvatAudio.playSfx('epic', get().sfxEnabled);
        get().showToast(`+${new Intl.NumberFormat('en-US').format(amount)} Mora diterima dari Ley Line`);
      },

      placeOrder: ({ deliveryPoint, paymentMethod, kitchenNotes }) => {
        const state = get();
        if (state.cart.length === 0) {
          return { ok: false, error: 'Tas belanja masih kosong.' };
        }

        const totals = state.getCartTotals();
        if (
          paymentMethod === 'NORTHLAND_BANK_CARD' &&
          state.profile.moraBalance < totals.finalTotal
        ) {
          return {
            ok: false,
            error: 'Saldo Mora di Kartu Northland Bank tidak mencukupi.',
          };
        }

        const now = new Date();
        const formattedTime = now.toLocaleString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const orderId = `ORD-TEYVAT-${String(Math.floor(1000 + Math.random() * 9000))}`;
        const newOrder: Order = {
          id: orderId,
          items: state.cart.map((item) => ({ ...item })),
          subtotalMora: totals.subtotal,
          deliveryFeeMora: totals.deliveryFee,
          discountMora: totals.discount,
          totalMora: totals.finalTotal,
          couponCode: state.appliedCouponCode,
          deliveryPoint,
          paymentMethod,
          kitchenNotes: kitchenNotes.trim(),
          status: 'COOKING',
          createdAt: formattedTime.replace(',', ' ·'),
        };

        set((prev) => ({
          orders: [newOrder, ...prev.orders],
          cart: [],
          appliedCouponCode: null,
          profile:
            paymentMethod === 'NORTHLAND_BANK_CARD'
              ? {
                  ...prev.profile,
                  moraBalance: Math.max(0, prev.profile.moraBalance - totals.finalTotal),
                }
              : prev.profile,
          stack: [{ name: 'order-status', orderId }],
        }));

        return { ok: true, order: newOrder };
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      },

      reorderFromHistory: (orderId) => {
        const target = get().orders.find((o) => o.id === orderId);
        if (!target) return;

        set((state) => {
          const nextCart = [...state.cart];
          for (const pastItem of target.items) {
            const existing = nextCart.find((c) => c.dish.id === pastItem.dish.id);
            if (existing) {
              existing.quantity = Math.min(99, existing.quantity + pastItem.quantity);
            } else {
              nextCart.push({ dish: pastItem.dish, quantity: pastItem.quantity });
            }
          }
          return {
            cart: nextCart,
            activeTab: 'cart',
            stack: [],
          };
        });
        teyvatAudio.playSfx('epic', get().sfxEnabled);
        get().showToast(`Pesanan ${target.id} dimasukkan kembali ke Tas`);
      },

      showToast: (message) => {
        if (toastTimer !== null && typeof window !== 'undefined') {
          window.clearTimeout(toastTimer);
        }
        set({ toastMessage: message });
        if (typeof window !== 'undefined') {
          toastTimer = window.setTimeout(() => {
            set({ toastMessage: null });
          }, 2400);
        }
      },

      clearToast: () => set({ toastMessage: null }),

      getCartTotals: () => {
        const { cart, appliedCouponCode } = get();
        const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        const subtotal = cart.reduce(
          (acc, item) => acc + item.dish.priceMora * item.quantity,
          0
        );
        if (itemCount === 0) {
          return {
            itemCount: 0,
            subtotal: 0,
            deliveryFee: 0,
            discount: 0,
            finalTotal: 0,
          };
        }

        const coupon = COUPONS.find((c) => c.code === appliedCouponCode) ?? null;
        let deliveryFee = DELIVERY_FEE_MORA;
        let discount = 0;

        if (coupon?.type === 'PERCENT') {
          discount = Math.round((subtotal * coupon.value) / 100);
        } else if (coupon?.type === 'FREE_DELIVERY') {
          deliveryFee = 0;
          discount = DELIVERY_FEE_MORA;
        }

        const finalTotal = Math.max(
          0,
          subtotal + deliveryFee - (coupon?.type === 'PERCENT' ? discount : 0)
        );

        return {
          itemCount,
          subtotal,
          deliveryFee,
          discount,
          finalTotal,
        };
      },
    }),
    {
      name: 'teyvat-delicacies-store-v1',
      partialize: (state) => ({
        cart: state.cart,
        appliedCouponCode: state.appliedCouponCode,
        favoriteIds: state.favoriteIds,
        profile: state.profile,
        orders: state.orders,
        sfxEnabled: state.sfxEnabled,
      }),
    }
  )
);
