import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DELIVERY_POINTS,
  INITIAL_ORDERS,
  INITIAL_PROFILE,
  NAMECARDS,
} from '../data/dishes';
import {
  CartTotals,
  calculateCartTotals,
  isLocalLiyueDelivery,
  validateCheckoutPayment,
  validateCouponApplication,
} from '../lib/delicaciesRules';
import {
  CartItem,
  CatalogFilterPreset,
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
  catalogPreset: CatalogFilterPreset | null;

  // Cart, Delivery Region & Vouchers
  cart: CartItem[];
  selectedDeliveryPointId: string;
  appliedCouponCode: string | null;
  voucherUsageCount: Record<string, number>;

  // Favorites, Profile, Namecard & Orders
  favoriteIds: number[];
  profile: TravelerProfile;
  selectedNamecardId: string;
  orders: Order[];

  // Toast Feedback
  toastMessage: string | null;

  // Actions
  enterTeyvat: () => void;
  setActiveTab: (tab: TabId) => void;
  openCatalogWithFilter: (preset: CatalogFilterPreset) => void;
  clearCatalogPreset: () => void;
  pushStack: (route: StackRoute) => void;
  popStack: () => void;
  resetToTab: (tab: TabId) => void;

  setSelectedDeliveryPointId: (pointId: string) => void;
  getSelectedDeliveryPoint: () => DeliveryPoint;

  addToCart: (dish: Dish, quantity?: number) => void;
  removeFromCart: (dishId: number) => void;
  updateQuantity: (dishId: number, quantity: number) => void;
  clearCart: () => void;

  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;

  toggleFavorite: (dishId: number) => void;
  topUpMora: (amount: number) => void;
  setSelectedNamecard: (namecardId: string) => void;

  placeOrder: (input: PlaceOrderInput) => { ok: boolean; order?: Order; error?: string };
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reorderFromHistory: (orderId: string) => void;

  showToast: (message: string) => void;
  clearToast: () => void;

  getCartTotals: (overridePoint?: DeliveryPoint | null) => CartTotals;
}

let toastTimer: number | null = null;

function resolveDeliveryPoint(pointId: string): DeliveryPoint {
  return DELIVERY_POINTS.find((p) => p.id === pointId) ?? DELIVERY_POINTS[0];
}

export const useDelicaciesStore = create<DelicaciesState>()(
  persist(
    (set, get) => ({
      hasEntered: false,
      activeTab: 'beranda',
      stack: [],
      catalogPreset: null,

      cart: [],
      selectedDeliveryPointId: DELIVERY_POINTS[0].id,
      appliedCouponCode: null,
      voucherUsageCount: {},

      favoriteIds: [5101, 4102, 4116],
      profile: INITIAL_PROFILE,
      selectedNamecardId: NAMECARDS[0].id,
      orders: INITIAL_ORDERS,

      toastMessage: null,

      enterTeyvat: () => {
        set({
          hasEntered: true,
          activeTab: 'beranda',
          stack: [],
        });
      },

      setActiveTab: (tab) => {
        set({ activeTab: tab, stack: [] });
      },

      openCatalogWithFilter: (preset) => {
        set({
          activeTab: 'katalog',
          stack: [],
          catalogPreset: preset,
        });
      },

      clearCatalogPreset: () => {
        set({ catalogPreset: null });
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

      setSelectedDeliveryPointId: (pointId) => {
        const nextPoint = resolveDeliveryPoint(pointId);
        const state = get();
        const subtotal = state.cart.reduce(
          (acc, item) => acc + item.dish.priceMora * item.quantity,
          0
        );

        let nextCoupon = state.appliedCouponCode;
        let autoRemovedMsg: string | null = null;

        if (nextCoupon && subtotal > 0) {
          const check = validateCouponApplication(
            nextCoupon,
            subtotal,
            nextPoint,
            state.voucherUsageCount
          );
          if (!check.ok) {
            nextCoupon = null;
            autoRemovedMsg = isLocalLiyueDelivery(nextPoint)
              ? 'Ongkir Liyue sudah gratis 0 Mora — voucher ongkir disimpan kembali'
              : `Voucher ${state.appliedCouponCode} dilepas karena syarat tidak terpenuhi`;
          }
        }

        set({
          selectedDeliveryPointId: nextPoint.id,
          appliedCouponCode: nextCoupon,
        });

        if (autoRemovedMsg) {
          get().showToast(autoRemovedMsg);
        }
      },

      getSelectedDeliveryPoint: () => {
        return resolveDeliveryPoint(get().selectedDeliveryPointId);
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

        get().showToast(`${dish.name} (×${safeQty}) masuk ke Keranjang`);
      },

      removeFromCart: (dishId) => {
        const state = get();
        const nextCart = state.cart.filter((item) => item.dish.id !== dishId);
        const nextSubtotal = nextCart.reduce(
          (acc, item) => acc + item.dish.priceMora * item.quantity,
          0
        );
        const activePoint = resolveDeliveryPoint(state.selectedDeliveryPointId);

        let nextCoupon = state.appliedCouponCode;
        let detachedCoupon: string | null = null;
        if (nextCoupon) {
          if (nextCart.length === 0) {
            nextCoupon = null;
          } else {
            const check = validateCouponApplication(
              nextCoupon,
              nextSubtotal,
              activePoint,
              state.voucherUsageCount
            );
            if (!check.ok) {
              detachedCoupon = nextCoupon;
              nextCoupon = null;
            }
          }
        }

        set({ cart: nextCart, appliedCouponCode: nextCoupon });
        if (detachedCoupon) {
          get().showToast(
            `Voucher ${detachedCoupon} dilepas karena subtotal di bawah syarat minimal`
          );
        }
      },

      updateQuantity: (dishId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(dishId);
          return;
        }
        const safeQty = Math.min(99, quantity);
        const state = get();
        const nextCart = state.cart.map((item) =>
          item.dish.id === dishId ? { ...item, quantity: safeQty } : item
        );
        const nextSubtotal = nextCart.reduce(
          (acc, item) => acc + item.dish.priceMora * item.quantity,
          0
        );
        const activePoint = resolveDeliveryPoint(state.selectedDeliveryPointId);

        let nextCoupon = state.appliedCouponCode;
        let detachedCoupon: string | null = null;
        if (nextCoupon) {
          const check = validateCouponApplication(
            nextCoupon,
            nextSubtotal,
            activePoint,
            state.voucherUsageCount
          );
          if (!check.ok) {
            detachedCoupon = nextCoupon;
            nextCoupon = null;
          }
        }

        set({ cart: nextCart, appliedCouponCode: nextCoupon });
        if (detachedCoupon) {
          get().showToast(
            `Voucher ${detachedCoupon} dilepas karena subtotal di bawah syarat minimal`
          );
        }
      },

      clearCart: () => {
        set({ cart: [], appliedCouponCode: null });
      },

      applyCoupon: (rawCode) => {
        const state = get();
        const subtotal = state.cart.reduce(
          (acc, item) => acc + item.dish.priceMora * item.quantity,
          0
        );
        const deliveryPoint = resolveDeliveryPoint(state.selectedDeliveryPointId);
        const validation = validateCouponApplication(
          rawCode,
          subtotal,
          deliveryPoint,
          state.voucherUsageCount
        );
        if (!validation.ok || !validation.coupon) {
          return { ok: false, message: validation.message };
        }
        set({ appliedCouponCode: validation.coupon.code });
        get().showToast(`Voucher ${validation.coupon.code} berhasil diterapkan`);
        return { ok: true, message: validation.message };
      },

      removeCoupon: () => {
        set({ appliedCouponCode: null });
        get().showToast('Voucher dilepas dari pesanan');
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
        get().showToast(
          `+${new Intl.NumberFormat('en-US').format(amount)} Mora diterima dari Ley Line`
        );
      },

      setSelectedNamecard: (namecardId) => {
        const match = NAMECARDS.find((n) => n.id === namecardId);
        if (!match) return;
        set({ selectedNamecardId: match.id });
        get().showToast(`Namecard "${match.name}" dipasang`);
      },

      placeOrder: ({ deliveryPoint, paymentMethod, kitchenNotes }) => {
        const state = get();
        const totals = calculateCartTotals(
          state.cart,
          state.appliedCouponCode,
          deliveryPoint,
          state.voucherUsageCount
        );
        const validation = validateCheckoutPayment(
          state.cart,
          paymentMethod,
          state.profile.moraBalance,
          totals.finalTotal
        );
        if (!validation.ok) {
          return { ok: false, error: validation.error };
        }

        // Confirm whether active coupon is genuinely valid at checkout time
        let usedCouponCode: string | null = null;
        if (state.appliedCouponCode) {
          const couponCheck = validateCouponApplication(
            state.appliedCouponCode,
            totals.subtotal,
            deliveryPoint,
            state.voucherUsageCount
          );
          if (couponCheck.ok && couponCheck.coupon) {
            usedCouponCode = couponCheck.coupon.code;
          }
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
          couponCode: usedCouponCode,
          deliveryPoint,
          paymentMethod,
          kitchenNotes: kitchenNotes.trim(),
          status: 'COOKING',
          createdAt: formattedTime.replace(',', ' ·'),
        };

        const nextVoucherUsage = usedCouponCode
          ? {
              ...state.voucherUsageCount,
              [usedCouponCode]: (state.voucherUsageCount[usedCouponCode] ?? 0) + 1,
            }
          : state.voucherUsageCount;

        set((prev) => ({
          orders: [newOrder, ...prev.orders],
          cart: [],
          appliedCouponCode: null,
          voucherUsageCount: nextVoucherUsage,
          selectedDeliveryPointId: deliveryPoint.id,
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
            selectedDeliveryPointId: target.deliveryPoint.id,
            activeTab: 'keranjang',
            stack: [],
          };
        });
        get().showToast(`Pesanan ${target.id} dimasukkan kembali ke Keranjang`);
      },

      showToast: (message) => {
        if (toastTimer !== null && typeof window !== 'undefined') {
          window.clearTimeout(toastTimer);
        }
        set({ toastMessage: message });
        if (typeof window !== 'undefined') {
          toastTimer = window.setTimeout(() => {
            set({ toastMessage: null });
          }, 2600);
        }
      },

      clearToast: () => set({ toastMessage: null }),

      getCartTotals: (overridePoint) => {
        const { cart, appliedCouponCode, selectedDeliveryPointId, voucherUsageCount } =
          get();
        const activePoint = overridePoint ?? resolveDeliveryPoint(selectedDeliveryPointId);
        return calculateCartTotals(
          cart,
          appliedCouponCode,
          activePoint,
          voucherUsageCount
        );
      },
    }),
    {
      name: 'teyvat-delicacies-store-v3',
      partialize: (state) => ({
        cart: state.cart,
        selectedDeliveryPointId: state.selectedDeliveryPointId,
        appliedCouponCode: state.appliedCouponCode,
        voucherUsageCount: state.voucherUsageCount,
        favoriteIds: state.favoriteIds,
        profile: state.profile,
        selectedNamecardId: state.selectedNamecardId,
        orders: state.orders,
      }),
    }
  )
);
