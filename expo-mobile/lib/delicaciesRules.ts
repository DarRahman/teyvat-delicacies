import { COUPONS, DELIVERY_FEE_MORA, formatMora } from '../data/dishes';
import {
  BuffType,
  CartItem,
  Coupon,
  DeliveryPoint,
  Dish,
  DishCategory,
  DishRarity,
  MapCoordinates,
  PaymentMethod,
  TeyvatRegion,
} from '../types';

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  baseDeliveryFee: number;
  deliveryFee: number;
  discount: number;
  finalTotal: number;
  isLocalLiyue: boolean;
}

export interface DishFilterCriteria {
  query?: string;
  category?: 'All Dishes' | DishCategory;
  buffs?: BuffType[];
  regions?: TeyvatRegion[];
  rarity?: DishRarity | null;
}

export interface CouponValidationResult {
  ok: boolean;
  coupon?: Coupon;
  message: string;
}

export function isLocalLiyueDelivery(deliveryPoint?: DeliveryPoint | null): boolean {
  if (!deliveryPoint) return false;
  return Boolean(deliveryPoint.isLocalLiyue || deliveryPoint.region === 'Liyue');
}

export function getDeliveryFeeForPoint(deliveryPoint?: DeliveryPoint | null): number {
  if (!deliveryPoint) return DELIVERY_FEE_MORA;
  if (isLocalLiyueDelivery(deliveryPoint)) return 0;
  return Math.max(0, deliveryPoint.deliveryFeeMora);
}

export function getRemainingVoucherUses(
  coupon: Coupon,
  voucherUsageCount: Record<string, number> = {}
): number {
  const used = Math.max(0, voucherUsageCount[coupon.code] ?? 0);
  return Math.max(0, coupon.maxUses - used);
}

export function validateCouponApplication(
  rawCode: string,
  subtotal: number,
  deliveryPoint: DeliveryPoint | null,
  voucherUsageCount: Record<string, number> = {}
): CouponValidationResult {
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) {
    return {
      ok: false,
      message: 'Masukkan kode voucher terlebih dahulu.',
    };
  }

  const coupon = COUPONS.find((c) => c.code === normalized);
  if (!coupon) {
    return {
      ok: false,
      message:
        'Kode voucher tidak ditemukan. Coba PAIMONKENYANG, GLIDERFREE, atau ADEPTUSFEAST.',
    };
  }

  const remaining = getRemainingVoucherUses(coupon, voucherUsageCount);
  if (remaining <= 0) {
    return {
      ok: false,
      message: `Kuota voucher ${coupon.code} sudah habis terpakai (${coupon.maxUses}/${coupon.maxUses}).`,
    };
  }

  if (subtotal <= 0) {
    return {
      ok: false,
      message: 'Tambahkan hidangan ke keranjang sebelum menebus voucher.',
    };
  }

  if (subtotal < coupon.minSubtotalMora) {
    const shortage = coupon.minSubtotalMora - subtotal;
    return {
      ok: false,
      message: `Minimal belanja ${formatMora(coupon.minSubtotalMora)} Mora untuk ${coupon.code} (kurang ${formatMora(shortage)} Mora).`,
    };
  }

  const baseDeliveryFee = getDeliveryFeeForPoint(deliveryPoint);
  if (coupon.type === 'FREE_DELIVERY' && baseDeliveryFee === 0) {
    return {
      ok: false,
      message:
        'Ongkir lokal Liyue sudah gratis 0 Mora — simpan voucher ini untuk pengiriman luar Liyue.',
    };
  }

  return {
    ok: true,
    coupon,
    message: `${coupon.title} aktif (sisa ${remaining}× pakai).`,
  };
}

export function calculateCartTotals(
  cart: CartItem[],
  appliedCouponCode: string | null,
  deliveryPoint?: DeliveryPoint | null,
  voucherUsageCount: Record<string, number> = {}
): CartTotals {
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.dish.priceMora * item.quantity,
    0
  );
  const localLiyue = isLocalLiyueDelivery(deliveryPoint);

  if (itemCount === 0) {
    return {
      itemCount: 0,
      subtotal: 0,
      baseDeliveryFee: 0,
      deliveryFee: 0,
      discount: 0,
      finalTotal: 0,
      isLocalLiyue: localLiyue,
    };
  }

  const baseDeliveryFee = getDeliveryFeeForPoint(deliveryPoint);
  let deliveryFee = baseDeliveryFee;
  let discount = 0;

  if (appliedCouponCode) {
    const check = validateCouponApplication(
      appliedCouponCode,
      subtotal,
      deliveryPoint ?? null,
      voucherUsageCount
    );
    if (check.ok && check.coupon) {
      if (check.coupon.type === 'PERCENT') {
        discount = Math.round((subtotal * check.coupon.value) / 100);
      } else if (check.coupon.type === 'FIXED_MORA') {
        discount = Math.min(subtotal, check.coupon.value);
      } else if (check.coupon.type === 'FREE_DELIVERY') {
        deliveryFee = 0;
        discount = baseDeliveryFee;
      }
    }
  }

  const appliedSubtotalDiscount =
    appliedCouponCode &&
    COUPONS.find((c) => c.code === appliedCouponCode)?.type !== 'FREE_DELIVERY'
      ? discount
      : 0;

  const finalTotal = Math.max(0, subtotal + deliveryFee - appliedSubtotalDiscount);

  return {
    itemCount,
    subtotal,
    baseDeliveryFee,
    deliveryFee,
    discount,
    finalTotal,
    isLocalLiyue: localLiyue,
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

export function clampGliderProgress(progress: number): number {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(100, Math.max(0, Math.round(progress * 10) / 10));
}

export function getGliderStageFromProgress(progress: number): 0 | 1 | 2 {
  const clamped = clampGliderProgress(progress);
  if (clamped >= 100) return 2;
  if (clamped >= 18) return 1;
  return 0;
}

export function buildGliderFlightArcPath(
  origin: MapCoordinates,
  destination: MapCoordinates
): string {
  const dx = destination.x - origin.x;
  const dy = destination.y - origin.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.5) {
    return '';
  }
  const midX = (origin.x + destination.x) / 2;
  const midY = (origin.y + destination.y) / 2;
  const lift = Math.min(14, Math.max(3, dist * 0.24));
  const ctrlX = midX;
  const ctrlY = Math.max(4, midY - lift);
  return `M ${origin.x.toFixed(1)} ${origin.y.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${destination.x.toFixed(1)} ${destination.y.toFixed(1)}`;
}
