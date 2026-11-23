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

export interface Dish {
  id: number;
  name: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  category: 'Main Dish' | 'Snacks' | 'Beverages';
  region: TeyvatRegion;
  buffType: BuffType;
  buffLabel: string;
  priceMora: number;
  image: string;
  description: string;
  effect: string;
  ingredients: { name: string; count: number; icon: string }[];
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}
