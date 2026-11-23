export type TeyvatRegion =
  | 'Mondstadt'
  | 'Liyue'
  | 'Inazuma'
  | 'Sumeru'
  | 'Fontaine'
  | 'Natlan'
  | 'Nod-Krai'
  | 'Snezhnaya';

export type BuffType = 'ATK' | 'DEF' | 'HP' | 'STAMINA';

export type DishCategory = 'Main Dish' | 'Snacks' | 'Beverages';

export type DishRarity = 1 | 2 | 3 | 4 | 5;

export interface DishIngredient {
  name: string;
  count: number;
  icon: string;
  fallbackIcon?: string;
}

export interface Dish {
  id: number;
  name: string;
  rarity: DishRarity;
  category: DishCategory;
  region: TeyvatRegion;
  buffType: BuffType;
  buffLabel: string;
  priceMora: number;
  image: string;
  fallbackImage: string;
  description: string;
  effect: string;
  ingredients: DishIngredient[];
  prepMinutes: number;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export interface Coupon {
  code: string;
  type: 'PERCENT' | 'FREE_DELIVERY';
  value: number;
  title: string;
  description: string;
  icon: string;
}

export interface MapCoordinates {
  x: number;
  y: number;
}

export interface DeliveryPoint {
  id: string;
  name: string;
  region: TeyvatRegion;
  landmark: string;
  etaMinutes: number;
  mapCoords: MapCoordinates;
}

export interface Namecard {
  id: string;
  name: string;
  region: TeyvatRegion;
  subtitle: string;
  bgImage: string;
  iconImage: string;
}

export type PaymentMethod = 'MORA_COD' | 'NORTHLAND_BANK_CARD';

export type OrderStatus = 'COOKING' | 'GLIDER_DISPATCHED' | 'COMPLETED';

export interface Order {
  id: string;
  items: CartItem[];
  subtotalMora: number;
  deliveryFeeMora: number;
  discountMora: number;
  totalMora: number;
  couponCode: string | null;
  deliveryPoint: DeliveryPoint;
  paymentMethod: PaymentMethod;
  kitchenNotes: string;
  status: OrderStatus;
  createdAt: string;
}

export interface TravelerProfile {
  uid: string;
  username: string;
  adventureRank: number;
  worldLevel: number;
  moraBalance: number;
  primogemBalance: number;
  reputationTitle: string;
  reputationRegion: TeyvatRegion;
  avatarUrl: string;
  fallbackAvatarUrl: string;
}

export type TabId = 'beranda' | 'katalog' | 'keranjang' | 'profil';

export interface CatalogFilterPreset {
  category?: 'All Dishes' | DishCategory;
  buff?: BuffType | null;
  region?: TeyvatRegion | null;
}

export type StackRoute =
  | { name: 'dish'; dishId: number }
  | { name: 'checkout' }
  | { name: 'order-status'; orderId: string };
