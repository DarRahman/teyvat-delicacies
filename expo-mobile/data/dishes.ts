import {
  AssetSource,
  BuffType,
  Coupon,
  DeliveryPoint,
  Dish,
  DishCategory,
  DishRarity,
  Namecard,
  Order,
  TeyvatRegion,
  TravelerAvatarId,
  TravelerProfile,
} from '../types';
import { LOCAL_ASSETS } from './assets';
import { YATTA_DISHES } from './yattaCatalog';

export const ASSET_ICONS = {
  mora: LOCAL_ASSETS.icons.mora,
  moraCdn: 'https://enka.network/ui/UI_ItemIcon_202.png',
  primogem: LOCAL_ASSETS.icons.primogem,
  primogemCdn: 'https://enka.network/ui/UI_ItemIcon_201.png',
  intertwinedFate: LOCAL_ASSETS.icons.intertwinedFate,
  intertwinedFateCdn: 'https://enka.network/ui/UI_ItemIcon_223.png',
  acquaintFate: LOCAL_ASSETS.icons.acquaintFate,
  fragileResin: LOCAL_ASSETS.icons.fragileResin,
  crownOfInsight: LOCAL_ASSETS.icons.crownOfInsight,
  genesisCrystal: LOCAL_ASSETS.icons.genesisCrystal,
  masterlessStardust: LOCAL_ASSETS.icons.masterlessStardust,
  masterlessStarglitter: LOCAL_ASSETS.icons.masterlessStarglitter,
  buffAtkCrit: LOCAL_ASSETS.icons.buffAtkCrit,
  buffRecoveryHpAll: LOCAL_ASSETS.icons.buffRecoveryHpAll,
  buffRecoveryRevive: LOCAL_ASSETS.icons.buffRecoveryRevive,
  buffAdventure: LOCAL_ASSETS.icons.buffAdventure,
  modalOrnament: LOCAL_ASSETS.ui.modalOrnament,
  paimonHungry: LOCAL_ASSETS.ui.paimonHungry,
  genshinLogo: LOCAL_ASSETS.ui.genshinLogo,
  celestiaDoor: LOCAL_ASSETS.backgrounds.celestiaDoor,
  dishDetailBg: LOCAL_ASSETS.backgrounds.dishDetailBg,
  constellationBg: LOCAL_ASSETS.backgrounds.constellationBg,
  resultCardBg: LOCAL_ASSETS.ui.resultCardBg,
  teyvatMap: LOCAL_ASSETS.map.teyvatWorldMap,
};

export const AVATAR_OPTIONS: Array<{
  id: TravelerAvatarId;
  name: string;
  subtitle: string;
  source: AssetSource;
}> = [
  {
    id: 'aether',
    name: 'Aether',
    subtitle: 'Traveler · Laki-laki',
    source: LOCAL_ASSETS.avatars.aether,
  },
  {
    id: 'lumine',
    name: 'Lumine',
    subtitle: 'Traveler · Perempuan',
    source: LOCAL_ASSETS.avatars.lumine,
  },
];

export function getAvatarSourceById(id?: TravelerAvatarId): AssetSource {
  return id === 'lumine' ? LOCAL_ASSETS.avatars.lumine : LOCAL_ASSETS.avatars.aether;
}

export const PRIMOGEM_RULES = {
  EXCHANGE_COST: 160,
  MORA_REWARD: 50000,
  ORDER_COMMISSION_REWARD: 60,
} as const;

export const BUFF_META: Record<
  BuffType,
  {
    label: string;
    shortLabel: string;
    icon: AssetSource;
    fallbackIcon: string;
    accentColor: string;
    bgTint: string;
  }
> = {
  ATK: {
    label: 'ATK Boost',
    shortLabel: 'Serangan',
    icon: LOCAL_ASSETS.icons.buffAtkAdd,
    fallbackIcon: 'https://gi.yatta.moe/assets/UI/UI_Buff_Item_Atk_Add.png',
    accentColor: '#C87C24',
    bgTint: 'rgba(200, 124, 36, 0.14)',
  },
  DEF: {
    label: 'DEF Boost',
    shortLabel: 'Pertahanan',
    icon: LOCAL_ASSETS.icons.buffDefAdd,
    fallbackIcon: 'https://gi.yatta.moe/assets/UI/UI_Buff_Item_Def_Add.png',
    accentColor: '#5987AD',
    bgTint: 'rgba(89, 135, 173, 0.15)',
  },
  HP: {
    label: 'HP Recovery',
    shortLabel: 'Pemulihan',
    icon: LOCAL_ASSETS.icons.buffRecoveryHp,
    fallbackIcon: 'https://gi.yatta.moe/assets/UI/UI_Buff_Item_Recovery_HpAdd.png',
    accentColor: '#4D8B6F',
    bgTint: 'rgba(90, 151, 122, 0.16)',
  },
  STAMINA: {
    label: 'Stamina',
    shortLabel: 'Stamina',
    icon: LOCAL_ASSETS.icons.buffStaminaReduce,
    fallbackIcon: 'https://gi.yatta.moe/assets/UI/UI_Buff_Item_Climate_Heat.png',
    accentColor: '#8B66B3',
    bgTint: 'rgba(148, 112, 187, 0.16)',
  },
};

export const RARITY_META: Record<
  DishRarity,
  {
    name: string;
    headerColor: string;
    gradientColors: readonly [string, string];
    glow: string;
    bgAsset: AssetSource;
  }
> = {
  1: {
    name: 'Common',
    headerColor: '#818486',
    gradientColors: ['#696C70', '#8C9094'],
    glow: 'rgba(129, 132, 134, 0.42)',
    bgAsset: LOCAL_ASSETS.icons.bg1Star,
  },
  2: {
    name: 'Uncommon',
    headerColor: '#5A977A',
    gradientColors: ['#43775E', '#68A889'],
    glow: 'rgba(90, 151, 122, 0.42)',
    bgAsset: LOCAL_ASSETS.icons.bg2Star,
  },
  3: {
    name: 'Rare',
    headerColor: '#5987AD',
    gradientColors: ['#416C91', '#6BA0C9'],
    glow: 'rgba(89, 135, 173, 0.42)',
    bgAsset: LOCAL_ASSETS.icons.bg3Star,
  },
  4: {
    name: 'Epic',
    headerColor: '#9470BB',
    gradientColors: ['#6F5194', '#A682CF'],
    glow: 'rgba(148, 112, 187, 0.42)',
    bgAsset: LOCAL_ASSETS.icons.bg4Star,
  },
  5: {
    name: 'Legendary',
    headerColor: '#C87C24',
    gradientColors: ['#9C5A14', '#D99238'],
    glow: 'rgba(200, 124, 36, 0.42)',
    bgAsset: LOCAL_ASSETS.icons.bg5Star,
  },
};

export const TEYVAT_REGIONS: TeyvatRegion[] = [
  'Mondstadt',
  'Liyue',
  'Inazuma',
  'Sumeru',
  'Fontaine',
  'Natlan',
  'Nod-Krai',
  'Snezhnaya',
];

export const DISH_CATEGORIES: Array<'All Dishes' | DishCategory> = [
  'All Dishes',
  'Main Dish',
  'Snacks',
  'Beverages',
];

export const CATEGORY_LABELS_ID: Record<'All Dishes' | DishCategory, string> = {
  'All Dishes': 'Semua Menu',
  'Main Dish': 'Hidangan Utama',
  Snacks: 'Camilan',
  Beverages: 'Minuman',
};

/** 80 Official Genshin Impact Dishes (10 per region × 8 regions) from gi.yatta.moe with 100% locally bundled PNGs */
export const DISHES: Dish[] = YATTA_DISHES;

/** Official Featured & Top 5 Chef Xiangling Recommendations */
export const FEATURED_DISH_ID = 108124; // Adeptus' Temptation (5★ Liyue)
export const TOP_RECOMMENDATION_IDS = [
  108124, // Adeptus' Temptation (5★ Liyue)
  108796, // Cheesy Crab Hotpot (5★ Natlan)
  108070, // Jade Parcels (4★ Liyue)
  108263, // Tonkotsu Ramen (3★ Inazuma)
  108112, // Barbatos Ratatouille (3★ Mondstadt)
];

export const DEFAULT_FAVORITE_IDS = [108124, 108796, 108070];

export const COUPONS: Coupon[] = [
  {
    code: 'PAIMONKENYANG',
    type: 'PERCENT',
    value: 20,
    minSubtotalMora: 10000,
    maxUses: 2,
    title: 'Voucher Paimon Kenyang',
    description: 'Potongan 20% subtotal pesanan · Min. belanja 10.000 Mora.',
    icon: LOCAL_ASSETS.icons.intertwinedFate,
  },
  {
    code: 'GLIDERFREE',
    type: 'FREE_DELIVERY',
    value: 1200,
    minSubtotalMora: 5000,
    maxUses: 3,
    title: 'Glider Kilat Gratis Ongkir',
    description: 'Gratis ongkir Kurir Wind Glider ke seluruh luar Liyue · Min. 5.000 Mora.',
    icon: LOCAL_ASSETS.icons.fragileResin,
  },
  {
    code: 'ADEPTUSFEAST',
    type: 'FIXED_MORA',
    value: 3000,
    minSubtotalMora: 15000,
    maxUses: 1,
    title: 'Jamuan Khusus Adeptus',
    description: 'Potongan langsung 3.000 Mora · Min. belanja 15.000 Mora.',
    icon: LOCAL_ASSETS.icons.acquaintFate,
  },
];

export const WANMIN_ORIGIN_COORDS = { x: 68, y: 65 };

export const DELIVERY_POINTS: DeliveryPoint[] = [
  {
    id: 'favonius-hq',
    name: 'Knights of Favonius HQ',
    region: 'Mondstadt',
    landmark: 'Gerbang Utama Markas Besar · Dekat Patung Barbatos',
    etaMinutes: 12,
    deliveryFeeMora: 400,
    mapCoords: { x: 75, y: 54 },
  },
  {
    id: 'wanmin-terrace',
    name: 'Teras Yujing · Pelabuhan Liyue',
    region: 'Liyue',
    landmark: 'Paviliun Yujing & Chihu Rock · Pengantaran Lokal Dapur Wanmin',
    etaMinutes: 6,
    deliveryFeeMora: 0,
    isLocalLiyue: true,
    mapCoords: { x: 66, y: 63 },
  },
  {
    id: 'narukami-shrine',
    name: 'Grand Narukami Shrine',
    region: 'Inazuma',
    landmark: 'Puncak Mt. Yougou · Dekat Pohon Sacred Sakura',
    etaMinutes: 18,
    deliveryFeeMora: 800,
    mapCoords: { x: 91, y: 81 },
  },
  {
    id: 'akademiya-courtyard',
    name: 'Akademiya Courtyard',
    region: 'Sumeru',
    landmark: 'Gerbang Sanctuary of Surasthana · Jalur Rampai',
    etaMinutes: 14,
    deliveryFeeMora: 500,
    mapCoords: { x: 58, y: 69 },
  },
  {
    id: 'maison-cardinalice',
    name: 'Court of Fontaine',
    region: 'Fontaine',
    landmark: 'Maison Cardinalice · Palais Mermonia Plaza',
    etaMinutes: 16,
    deliveryFeeMora: 650,
    mapCoords: { x: 52, y: 47 },
  },
  {
    id: 'tequemecan-springs',
    name: 'Tequemecan Springs',
    region: 'Natlan',
    landmark: 'Stadium of the Sacred Flame · Teras Api Abadi',
    etaMinutes: 20,
    deliveryFeeMora: 900,
    mapCoords: { x: 33, y: 74 },
  },
  {
    id: 'nasha-outpost',
    name: 'Nasha Town Outpost',
    region: 'Nod-Krai',
    landmark: 'Dermaga Frostmoon · Mercusuar Perbatasan Utara',
    etaMinutes: 21,
    deliveryFeeMora: 1000,
    mapCoords: { x: 29, y: 37 },
  },
  {
    id: 'zapolyarny-palace',
    name: 'Zapolyarny Palace Square',
    region: 'Snezhnaya',
    landmark: 'Alun-Alun Istana Salju · Gerbang Northland Bank',
    etaMinutes: 24,
    deliveryFeeMora: 1200,
    mapCoords: { x: 47, y: 21 },
  },
];

export const NAMECARDS: Namecard[] = [
  {
    id: 'natlan_saurian',
    name: 'Natlan · Divine Flame',
    region: 'Natlan',
    subtitle: 'Kehormatan Stadium of the Sacred Flame',
    bgImage: LOCAL_ASSETS.namecards.natlanSaurianBg,
    iconImage: LOCAL_ASSETS.namecards.natlanSaurianIcon,
  },
  {
    id: 'furina_fountain',
    name: 'Furina · Banquet',
    region: 'Fontaine',
    subtitle: 'Simfoni Panggung Opera Epiclese',
    bgImage: LOCAL_ASSETS.namecards.furinaFountainBg,
    iconImage: LOCAL_ASSETS.namecards.furinaFountainIcon,
  },
  {
    id: 'fontaine_glory',
    name: 'Fontaine · Completeness',
    region: 'Fontaine',
    subtitle: 'Panji Kemegahan Court of Fontaine',
    bgImage: LOCAL_ASSETS.namecards.fontaineGloryBg,
    iconImage: LOCAL_ASSETS.namecards.fontaineGloryIcon,
  },
  {
    id: 'nahida_dendro',
    name: 'Nahida · Crescent',
    region: 'Sumeru',
    subtitle: 'Kebijaksanaan Sanctuary of Surasthana',
    bgImage: LOCAL_ASSETS.namecards.nahidaDendroBg,
    iconImage: LOCAL_ASSETS.namecards.nahidaDendroIcon,
  },
  {
    id: 'raiden_shogun',
    name: 'Raiden Shogun · Enlightenment',
    region: 'Inazuma',
    subtitle: 'Keabadian Petir Pulau Narukami',
    bgImage: LOCAL_ASSETS.namecards.raidenShogunBg,
    iconImage: LOCAL_ASSETS.namecards.raidenShogunIcon,
  },
  {
    id: 'zhongli_rex',
    name: 'Zhongli · Planet Befall',
    region: 'Liyue',
    subtitle: 'Kontrak Abadi Geo Archon',
    bgImage: LOCAL_ASSETS.namecards.zhongliRexBg,
    iconImage: LOCAL_ASSETS.namecards.zhongliRexIcon,
  },
  {
    id: 'liyue_harbor',
    name: 'Liyue · Stillness of Stone',
    region: 'Liyue',
    subtitle: 'Lentera Pelabuhan Chihu Rock',
    bgImage: LOCAL_ASSETS.namecards.liyueHarborBg,
    iconImage: LOCAL_ASSETS.namecards.liyueHarborBg,
  },
  {
    id: 'mondstadt_favonius',
    name: "Mondstadt · Hero's Fame",
    region: 'Mondstadt',
    subtitle: 'Kebebasan Angin Knights of Favonius',
    bgImage: LOCAL_ASSETS.namecards.mondstadtFavoniusBg,
    iconImage: LOCAL_ASSETS.namecards.mondstadtFavoniusBg,
  },
];

export const INITIAL_PROFILE: TravelerProfile = {
  uid: '14524303',
  username: 'Badar Rahman',
  email: 'badarrahman1905@gmail.com',
  bio: "Petualang kuliner lintas 8 wilayah Teyvat · Anggota resmi Adventurers' Guild & pelanggan setia Dapur Wanmin.",
  adventureRank: 60,
  worldLevel: 9,
  moraBalance: 1452430,
  primogemBalance: 1600,
  reputationTitle: 'Honorary Knight · Favonius Lv. 10',
  reputationRegion: 'Mondstadt',
  avatarId: 'aether',
  avatarUrl: LOCAL_ASSETS.avatars.aether,
  fallbackAvatarUrl: LOCAL_ASSETS.avatars.aether,
};

function findDishOrFallback(id: number): Dish {
  return DISHES.find((d) => d.id === id) ?? DISHES[0];
}

const seedDishAdeptus = findDishOrFallback(108124);
const seedDishDango = findDishOrFallback(108254);
const seedDishRamen = findDishOrFallback(108263);
const seedDishDangoMilk = findDishOrFallback(108305);

const order1Subtotal = seedDishAdeptus.priceMora + seedDishDango.priceMora * 2;
const order1Discount = Math.round(order1Subtotal * 0.2);

const order2Subtotal = seedDishRamen.priceMora * 2 + seedDishDangoMilk.priceMora * 2;

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-TEYVAT-7708',
    items: [
      { dish: seedDishAdeptus, quantity: 1 },
      { dish: seedDishDango, quantity: 2 },
    ],
    subtotalMora: order1Subtotal,
    deliveryFeeMora: 400,
    discountMora: order1Discount,
    totalMora: order1Subtotal + 400 - order1Discount,
    couponCode: 'PAIMONKENYANG',
    deliveryPoint: DELIVERY_POINTS[0],
    paymentMethod: 'NORTHLAND_BANK_CARD',
    kitchenNotes: 'Kurangi Jueyun Chili agar Paimon bisa ikut mencicipi.',
    status: 'COMPLETED',
    createdAt: '22 Nov 2026 · 19:42',
    rewardClaimed: true,
  },
  {
    id: 'ORD-TEYVAT-7694',
    items: [
      { dish: seedDishRamen, quantity: 2 },
      { dish: seedDishDangoMilk, quantity: 2 },
    ],
    subtotalMora: order2Subtotal,
    deliveryFeeMora: 0,
    discountMora: 800,
    totalMora: order2Subtotal,
    couponCode: 'GLIDERFREE',
    deliveryPoint: DELIVERY_POINTS[2],
    paymentMethod: 'MORA_COD',
    kitchenNotes: 'Kuah ramen dipisah agar tetap panas saat glider mendarat.',
    status: 'COMPLETED',
    createdAt: '20 Nov 2026 · 13:15',
    rewardClaimed: true,
  },
];

export const DELIVERY_FEE_MORA = 400;

export function formatMora(amount: number): string {
  const safe = Math.max(0, Math.round(amount));
  return safe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
