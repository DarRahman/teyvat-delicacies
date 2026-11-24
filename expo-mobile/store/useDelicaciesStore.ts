import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  COUPONS,
  DEFAULT_FAVORITE_IDS,
  DELIVERY_POINTS,
  DISHES,
  INITIAL_ORDERS,
  INITIAL_PROFILE,
  NAMECARDS,
  PRIMOGEM_RULES,
  formatMora,
  getAvatarSourceById,
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
  TravelerAvatarId,
  TravelerProfile,
} from '../types';

interface PlaceOrderInput {
  deliveryPoint: DeliveryPoint;
  paymentMethod: PaymentMethod;
  kitchenNotes: string;
}

interface ProfileSettingsInput {
  username: string;
  bio: string;
  avatarId: TravelerAvatarId;
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
  exchangePrimogemsForMora: () => { ok: boolean; message: string };
  exchangePrimogemsForVoucherRefill: (
    couponCode: string
  ) => { ok: boolean; message: string };
  updateProfileSettings: (input: ProfileSettingsInput) => void;
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
  return canonical ?? DISHES[0];
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

      favoriteIds: DEFAULT_FAVORITE_IDS,
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

      exchangePrimogemsForMora: () => {
        const state = get();
        const cost = PRIMOGEM_RULES.EXCHANGE_COST;
        const reward = PRIMOGEM_RULES.MORA_REWARD;
        if (state.profile.primogemBalance < cost) {
          const msg = `Primogem tidak cukup (butuh ${cost} Primogem). Selesaikan pesanan untuk +${PRIMOGEM_RULES.ORDER_COMMISSION_REWARD} Primogem.`;
          get().showToast(msg);
          return { ok: false, message: msg };
        }
        set((prev) => ({
          profile: {
            ...prev.profile,
            primogemBalance: prev.profile.primogemBalance - cost,
            moraBalance: prev.profile.moraBalance + reward,
          },
        }));
        const okMsg = `Tukar ${cost} Primogem → +${formatMora(reward)} Mora berhasil!`;
        get().showToast(okMsg);
        return { ok: true, message: okMsg };
      },

      exchangePrimogemsForVoucherRefill: (couponCode) => {
        const state = get();
        const cost = PRIMOGEM_RULES.EXCHANGE_COST;
        const coupon = COUPONS.find((c) => c.code === couponCode);
        if (!coupon) {
          return { ok: false, message: 'Voucher tidak ditemukan.' };
        }
        const used = state.voucherUsageCount[coupon.code] ?? 0;
        if (used <= 0) {
          const msg = `Kuota ${coupon.code} sudah penuh (${coupon.maxUses}/${coupon.maxUses}).`;
          get().showToast(msg);
          return { ok: false, message: msg };
        }
        if (state.profile.primogemBalance < cost) {
          const msg = `Primogem tidak cukup (butuh ${cost} Primogem).`;
          get().showToast(msg);
          return { ok: false, message: msg };
        }
        set((prev) => ({
          profile: {
            ...prev.profile,
            primogemBalance: prev.profile.primogemBalance - cost,
          },
          voucherUsageCount: {
            ...prev.voucherUsageCount,
            [coupon.code]: Math.max(0, (prev.voucherUsageCount[coupon.code] ?? 0) - 1),
          },
        }));
        const okMsg = `Kuota ${coupon.code} diisi ulang +1× (${cost} Primogem)`;
        get().showToast(okMsg);
        return { ok: true, message: okMsg };
      },

      updateProfileSettings: ({ username, bio, avatarId }) => {
        const trimmedName = username.trim() || INITIAL_PROFILE.username;
        const trimmedBio = bio.trim() || INITIAL_PROFILE.bio;
        const avatarSource = getAvatarSourceById(avatarId);
        set((state) => ({
          profile: {
            ...state.profile,
            uid: INITIAL_PROFILE.uid, // NIM locked
            username: trimmedName,
            bio: trimmedBio,
            avatarId,
            avatarUrl: avatarSource,
            fallbackAvatarUrl: avatarSource,
          },
        }));
        get().showToast('Profil Petualang berhasil diperbarui');
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
          favoriteIds: DEFAULT_FAVORITE_IDS,
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
          rewardClaimed: false,
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
        let grantedReward = false;
        set((state) => {
          const target = state.orders.find((o) => o.id === orderId);
          const shouldGrant =
            status === 'COMPLETED' && Boolean(target) && !target?.rewardClaimed;
          if (shouldGrant) {
            grantedReward = true;
          }

          return {
            orders: state.orders.map((order) =>
              order.id === orderId
                ? {
                    ...order,
                    status,
                    rewardClaimed: shouldGrant ? true : order.rewardClaimed,
                  }
                : order
            ),
            profile: shouldGrant
              ? {
                  ...state.profile,
                  primogemBalance:
                    state.profile.primogemBalance +
                    PRIMOGEM_RULES.ORDER_COMMISSION_REWARD,
                }
              : state.profile,
          };
        });

        if (grantedReward) {
          get().showToast(
            `+${PRIMOGEM_RULES.ORDER_COMMISSION_REWARD} Primogem hadiah Commission diterima!`
          );
        }
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
      name: 'teyvat-delicacies-mobile-v2',
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
        const hydratedAvatarId: TravelerAvatarId =
          incoming.profile?.avatarId === 'lumine' ? 'lumine' : 'aether';
        const avatarSource = getAvatarSourceById(hydratedAvatarId);
        const hydratedProfile: TravelerProfile = {
          ...INITIAL_PROFILE,
          ...(incoming.profile ?? {}),
          uid: INITIAL_PROFILE.uid, // NIM locked
          worldLevel: Math.max(9, incoming.profile?.worldLevel ?? 9),
          avatarId: hydratedAvatarId,
          avatarUrl: avatarSource,
          fallbackAvatarUrl: avatarSource,
        };
        const validDishIds = new Set(DISHES.map((d) => d.id));
        const hydratedFavorites = Array.isArray(incoming.favoriteIds)
          ? incoming.favoriteIds.filter((id) => validDishIds.has(id))
          : current.favoriteIds;
        return {
          ...current,
          ...incoming,
          cart: hydratedCart,
          orders: hydratedOrders,
          favoriteIds:
            hydratedFavorites.length > 0 ? hydratedFavorites : DEFAULT_FAVORITE_IDS,
          profile: hydratedProfile,
        };
      },
    }
  )
);
