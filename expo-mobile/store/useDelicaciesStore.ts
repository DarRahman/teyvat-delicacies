import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  DELIVERY_POINTS,
  DISHES,
  INITIAL_ORDERS,
  INITIAL_PROFILE,
  NAMECARDS,
  formatMora,
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
  TravelerProfile,
} from '../types';

interface PlaceOrderInput {
  deliveryPoint: DeliveryPoint;
  paymentMethod: PaymentMethod;
  kitchenNotes: string;
}

interface DelicaciesState {
  catalogPreset: CatalogFilterPreset | null;

  cart: CartItem[];
  selectedDeliveryPointId: string;
  appliedCouponCode: string | null;
  voucherUsageCount: Record<string, number>;

  favoriteIds: number[];
  profile: TravelerProfile;
  selectedNamecardId: string;
  orders: Order[];

  toastMessage: string | null;

  setCatalogPreset: (preset: CatalogFilterPreset | null) => void;
  clearCatalogPreset: () => void;

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
  resetSimulationData: () => void;

  placeOrder: (input: PlaceOrderInput) => { ok: boolean; order?: Order; error?: string };
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reorderFromHistory: (orderId: string) => boolean;

  showToast: (message: string) => void;
  clearToast: () => void;

  getCartTotals: (overridePoint?: DeliveryPoint | null) => CartTotals;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

function resolveDeliveryPoint(pointId: string): DeliveryPoint {
  return DELIVERY_POINTS.find((p) => p.id === pointId) ?? DELIVERY_POINTS[0];
}

/** Re-hydrate bundled local require() dish image references after AsyncStorage JSON parse */
function rehydrateDish(dish: Dish): Dish {
  const canonical = DISHES.find((d) => d.id === dish.id);
  return canonical ?? dish;
}

function formatOrderTimestamp(date: Date): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()] ?? 'Nov';
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} · ${hours}:${minutes}`;
}

export const useDelicaciesStore = create<DelicaciesState>()(
  persist(
    (set, get) => ({
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

      setCatalogPreset: (preset) => set({ catalogPreset: preset }),
      clearCatalogPreset: () => set({ catalogPreset: null }),

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
        const canonical = rehydrateDish(dish);
        set((state) => {
          const existing = state.cart.find((item) => item.dish.id === canonical.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.dish.id === canonical.id
                  ? { ...item, quantity: Math.min(99, item.quantity + safeQty) }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, { dish: canonical, quantity: safeQty }],
          };
        });

        get().showToast(`${canonical.name} (×${safeQty}) masuk ke Keranjang`);
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

      clearCart: () => set({ cart: [], appliedCouponCode: null }),

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
        get().showToast(`+${formatMora(amount)} Mora diterima dari Ley Line`);
      },

      setSelectedNamecard: (namecardId) => {
        const match = NAMECARDS.find((n) => n.id === namecardId);
        if (!match) return;
        set({ selectedNamecardId: match.id });
        get().showToast(`Namecard "${match.name}" dipasang`);
      },

      resetSimulationData: () => {
        set({
          cart: [],
          selectedDeliveryPointId: DELIVERY_POINTS[0].id,
          appliedCouponCode: null,
          voucherUsageCount: {},
          favoriteIds: [5101, 4102, 4116],
          profile: INITIAL_PROFILE,
          selectedNamecardId: NAMECARDS[0].id,
          orders: INITIAL_ORDERS,
        });
        get().showToast('Data simulasi Teyvat dikembalikan ke awal');
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

        const orderId = `ORD-TEYVAT-${String(Math.floor(1000 + Math.random() * 9000))}`;
        const newOrder: Order = {
          id: orderId,
          items: state.cart.map((item) => ({
            dish: rehydrateDish(item.dish),
            quantity: item.quantity,
          })),
          subtotalMora: totals.subtotal,
          deliveryFeeMora: totals.deliveryFee,
          discountMora: totals.discount,
          totalMora: totals.finalTotal,
          couponCode: usedCouponCode,
          deliveryPoint,
          paymentMethod,
          kitchenNotes: kitchenNotes.trim(),
          status: 'COOKING',
          createdAt: formatOrderTimestamp(new Date()),
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
        if (!target) return false;

        set((state) => {
          const nextCart = [...state.cart];
          for (const pastItem of target.items) {
            const canonical = rehydrateDish(pastItem.dish);
            const existing = nextCart.find((c) => c.dish.id === canonical.id);
            if (existing) {
              existing.quantity = Math.min(99, existing.quantity + pastItem.quantity);
            } else {
              nextCart.push({ dish: canonical, quantity: pastItem.quantity });
            }
          }
          return {
            cart: nextCart,
            selectedDeliveryPointId: target.deliveryPoint.id,
          };
        });
        get().showToast(`Pesanan ${target.id} dimasukkan kembali ke Keranjang`);
        return true;
      },

      showToast: (message) => {
        if (toastTimer !== null) {
          clearTimeout(toastTimer);
        }
        set({ toastMessage: message });
        toastTimer = setTimeout(() => {
          set({ toastMessage: null });
        }, 2600);
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
      name: 'teyvat-delicacies-mobile-v1',
      storage: createJSONStorage(() => AsyncStorage),
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
      merge: (persisted, current) => {
        const incoming = (persisted as Partial<DelicaciesState> | undefined) ?? {};
        const hydratedCart = Array.isArray(incoming.cart)
          ? incoming.cart.map((item) => ({
              ...item,
              dish: rehydrateDish(item.dish),
            }))
          : current.cart;
        const hydratedOrders = Array.isArray(incoming.orders)
          ? incoming.orders.map((ord) => ({
              ...ord,
              items: ord.items.map((item) => ({
                ...item,
                dish: rehydrateDish(item.dish),
              })),
            }))
          : current.orders;
        const hydratedProfile: TravelerProfile = {
          ...INITIAL_PROFILE,
          ...(incoming.profile ?? {}),
          fallbackAvatarUrl: INITIAL_PROFILE.fallbackAvatarUrl,
        };
        return {
          ...current,
          ...incoming,
          cart: hydratedCart,
          orders: hydratedOrders,
          profile: hydratedProfile,
        };
      },
    }
  )
);
