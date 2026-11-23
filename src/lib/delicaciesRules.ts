import { COUPONS, DELIVERY_FEE_MORA } from '../data/dishes';
import {
  BuffType,
  CartItem,
  Dish,
  DishCategory,
  DishRarity,
  PaymentMethod,
  TeyvatRegion,
} from '../types';

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  finalTotal: number;
}

export interface DishFilterCriteria {
  query?: string;
  category?: 'All Dishes' | DishCategory;
  buffs?: BuffType[];
  regions?: TeyvatRegion[];
  rarity?: DishRarity | null;
}

export function calculateCartTotals(
  cart: CartItem[],
  appliedCouponCode: string | null
): CartTotals {
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
}

export function filterDishes(dishes: Dish[], criteria: DishFilterCriteria): Dish[] {
  const q = (criteria.query ?? '').trim().toLowerCase();
  const category = criteria.category ?? 'All Dishes';
  const buffs = criteria.buffs ?? [];
  const regions = criteria.regions ?? [];
  const rarity = criteria.rarity ?? null;

  return dishes.filter((dish) => {
    if (category !== 'All Dishes' && dish.category !== category) {
      return false;
    }
    if (buffs.length > 0 && !buffs.includes(dish.buffType)) {
      return false;
    }
    if (regions.length > 0 && !regions.includes(dish.region)) {
      return false;
    }
    if (rarity !== null && dish.rarity !== rarity) {
      return false;
    }
    if (!q) return true;
    return (
      dish.name.toLowerCase().includes(q) ||
      dish.region.toLowerCase().includes(q) ||
      dish.buffLabel.toLowerCase().includes(q) ||
      dish.buffType.toLowerCase().includes(q) ||
      dish.effect.toLowerCase().includes(q)
    );
  });
}

export function validateCheckoutPayment(
  cart: CartItem[],
  paymentMethod: PaymentMethod,
  moraBalance: number,
  finalTotal: number
): { ok: boolean; error?: string } {
  if (cart.length === 0) {
    return { ok: false, error: 'Keranjang belanja masih kosong.' };
  }
  if (paymentMethod === 'NORTHLAND_BANK_CARD' && moraBalance < finalTotal) {
    return {
      ok: false,
      error: 'Saldo Mora di Kartu Northland Bank tidak mencukupi.',
    };
  }
  return { ok: true };
}
