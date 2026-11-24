import { ImageSource } from 'expo-image';

export type AssetSource = ImageSource | number | string;

export type TravelerAvatarId = 'aether' | 'lumine';

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
  icon: AssetSource;
  fallbackIcon?: AssetSource;
}

export interface Dish {
  id: number;
  name: string;
  rarity: DishRarity;
  category: DishCategory;
  region: TeyvatRegion;
  buffType: BuffType;
  buffLabel: string;
  buffIcon?: AssetSource;
  priceMora: number;
  image: AssetSource;
  fallbackImage?: AssetSource;
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
  type: 'PERCENT' | 'FREE_DELIVERY' | 'FIXED_MORA';
  value: number;
  minSubtotalMora: number;
  maxUses: number;
  title: string;
  description: string;
  icon: AssetSource;
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
  deliveryFeeMora: number;
  isLocalLiyue?: boolean;
  mapCoords: MapCoordinates;
}

export interface Namecard {
  id: string;
  name: string;
  region: TeyvatRegion;
  subtitle: string;
  bgImage: AssetSource;
  iconImage: AssetSource;
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
  rewardClaimed?: boolean;
}

export interface TravelerProfile {
  uid: string;
  username: string;
  email: string;
  bio: string;
  adventureRank: number;
  worldLevel: number;
  moraBalance: number;
  primogemBalance: number;
  reputationTitle: string;
  reputationRegion: TeyvatRegion;
  avatarId: TravelerAvatarId;
  avatarUrl: AssetSource;
  fallbackAvatarUrl: AssetSource;
}

export interface CatalogFilterPreset {
  category?: 'All Dishes' | DishCategory;
  buff?: BuffType | null;
  region?: TeyvatRegion | null;
}
