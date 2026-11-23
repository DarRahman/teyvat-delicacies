import {
  BuffType,
  Coupon,
  DeliveryPoint,
  Dish,
  DishCategory,
  DishRarity,
  Namecard,
  Order,
  TeyvatRegion,
  TravelerProfile,
} from '../types';

export const ASSET_ICONS = {
  mora: '/assets/icons/mora.png',
  moraCdn: 'https://enka.network/ui/UI_ItemIcon_202.png',
  primogem: '/assets/icons/primogem.png',
  primogemCdn: 'https://enka.network/ui/UI_ItemIcon_201.png',
  intertwinedFate: '/assets/icons/intertwined_fate.png',
  intertwinedFateCdn: 'https://enka.network/ui/UI_ItemIcon_223.png',
  fragileResin: '/assets/icons/fragile_resin.png',
  crownOfInsight: '/assets/icons/crown_of_insight.png',
  genesisCrystal: '/assets/icons/genesis_crystal.png',
  modalOrnament: '/assets/ui/modal_ornament_icon.png',
  paimonHungry: '/assets/ui/paimon_hungry_mascot.png',
  genshinLogo: '/assets/ui/genshin_logo.webp',
  celestiaDoor: '/assets/backgrounds/genshin_celestia_login_door_1080p.webp',
  celestiaDoorVideoMp4: '/assets/video/celestia_door_open.mp4',
  celestiaDoorVideoWebm: '/assets/video/celestia_door_open.webm',
  dishDetailBg: '/assets/backgrounds/dish_detail_bg.webp',
  constellationBg: '/assets/backgrounds/constellation_stars_bg.webp',
  resultCardBg: '/assets/ui/result_card_bg.webp',
  teyvatMap: '/assets/map/teyvat_world_map.webp',
  teyvatMapHd: '/assets/map/teyvat_world_map_hd.webp',
};

export const BUFF_META: Record<
  BuffType,
  {
    label: string;
    shortLabel: string;
    icon: string;
    fallbackIcon: string;
    accentColor: string;
    bgTint: string;
  }
> = {
  ATK: {
    label: 'ATK Boost',
    shortLabel: 'Serangan',
    icon: '/assets/icons/buff_atk_add.png',
    fallbackIcon: 'https://gi.yatta.moe/assets/UI/UI_Buff_Item_Atk_Add.png',
    accentColor: '#C87C24',
    bgTint: 'rgba(200, 124, 36, 0.14)',
  },
  DEF: {
    label: 'DEF Boost',
    shortLabel: 'Pertahanan',
    icon: '/assets/icons/buff_def_add.png',
    fallbackIcon: 'https://gi.yatta.moe/assets/UI/UI_Buff_Item_Def_Add.png',
    accentColor: '#5987AD',
    bgTint: 'rgba(89, 135, 173, 0.15)',
  },
  HP: {
    label: 'HP Recovery',
    shortLabel: 'Pemulihan',
    icon: '/assets/icons/buff_recovery_hp.png',
    fallbackIcon: 'https://gi.yatta.moe/assets/UI/UI_Buff_Item_Recovery_HpAdd.png',
    accentColor: '#4D8B6F',
    bgTint: 'rgba(90, 151, 122, 0.16)',
  },
  STAMINA: {
    label: 'Stamina',
    shortLabel: 'Stamina',
    icon: '/assets/icons/buff_stamina_reduce.png',
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
    gradient: string;
    glow: string;
    bgAsset: string;
  }
> = {
  1: {
    name: 'Common',
    headerColor: '#818486',
    gradient: 'linear-gradient(135deg, #696C70 0%, #8C9094 100%)',
    glow: 'rgba(129, 132, 134, 0.42)',
    bgAsset: '/assets/icons/bg_1star.webp',
  },
  2: {
    name: 'Uncommon',
    headerColor: '#5A977A',
    gradient: 'linear-gradient(135deg, #43775E 0%, #68A889 100%)',
    glow: 'rgba(90, 151, 122, 0.42)',
    bgAsset: '/assets/icons/bg_2star.webp',
  },
  3: {
    name: 'Rare',
    headerColor: '#5987AD',
    gradient: 'linear-gradient(135deg, #416C91 0%, #6BA0C9 100%)',
    glow: 'rgba(89, 135, 173, 0.42)',
    bgAsset: '/assets/icons/bg_3star.webp',
  },
  4: {
    name: 'Epic',
    headerColor: '#9470BB',
    gradient: 'linear-gradient(135deg, #6F5194 0%, #A682CF 100%)',
    glow: 'rgba(148, 112, 187, 0.42)',
    bgAsset: '/assets/icons/bg_4star.webp',
  },
  5: {
    name: 'Legendary',
    headerColor: '#C87C24',
    gradient: 'linear-gradient(135deg, #9C5A14 0%, #D99238 100%)',
    glow: 'rgba(200, 124, 36, 0.42)',
    bgAsset: '/assets/icons/bg_5star.webp',
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

const ING_CDN = 'https://gi.yatta.moe/assets/UI/';

export const DISHES: Dish[] = [
  {
    id: 5101,
    name: "Adeptus' Temptation",
    rarity: 5,
    category: 'Main Dish',
    region: 'Liyue',
    buffType: 'ATK',
    buffLabel: 'ATK +372',
    priceMora: 12500,
    image: '/assets/dishes/adeptus_temptation.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108123.png',
    description:
      'Hidangan legendaris khas Liyue yang dimasak perlahan menggunakan kaldu bahan darat dan laut pilihan. Aromanya begitu memikat hingga dipercaya mampu memanggil para Adeptus turun dari puncak Jueyun Karst.',
    effect:
      'Meningkatkan ATK seluruh anggota party sebesar 372 dan CRIT Rate sebesar 12% selama 300 detik.',
    prepMinutes: 18,
    ingredients: [
      { name: 'Ham', count: 4, icon: `${ING_CDN}UI_ItemIcon_110005.png` },
      { name: 'Crab', count: 3, icon: `${ING_CDN}UI_ItemIcon_100073.png` },
      { name: 'Shrimp Meat', count: 3, icon: `${ING_CDN}UI_ItemIcon_100093.png` },
      { name: 'Matsutake', count: 3, icon: `${ING_CDN}UI_ItemIcon_100063.png` },
    ],
  },
  {
    id: 4102,
    name: 'Jade Parcels',
    rarity: 4,
    category: 'Main Dish',
    region: 'Liyue',
    buffType: 'ATK',
    buffLabel: 'ATK +320',
    priceMora: 8800,
    image: '/assets/dishes/jade_parcels.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108122.png',
    description:
      'Bungkusan daun lotus lembut berisi ham asap dan Jueyun Chili hangat yang diracik penuh ketelitian. Kaldu pedas gurih langsung meledak begitu gigitan pertama menembus lapisannya.',
    effect:
      'Meningkatkan ATK seluruh anggota party sebesar 320 dan CRIT Rate sebesar 10% selama 300 detik.',
    prepMinutes: 14,
    ingredients: [
      { name: 'Lotus Head', count: 3, icon: `${ING_CDN}UI_ItemIcon_100026.png` },
      { name: 'Jueyun Chili', count: 2, icon: `${ING_CDN}UI_ItemIcon_100027.png` },
      { name: 'Cabbage', count: 2, icon: `${ING_CDN}UI_ItemIcon_100018.png` },
      { name: 'Ham', count: 1, icon: `${ING_CDN}UI_ItemIcon_110005.png` },
    ],
  },
  {
    id: 4116,
    name: 'Blazed Meat Stew',
    rarity: 4,
    category: 'Main Dish',
    region: 'Natlan',
    buffType: 'ATK',
    buffLabel: 'ATK +312',
    priceMora: 8200,
    image: '/assets/dishes/magmic_ode.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108733.png',
    description:
      'Semur daging panggang bara api berempah pekat khas Stadium of the Sacred Flame, Natlan. Panas rempah ember-nya menyulut tekad tempur para pejuang suku-suku Natlan.',
    effect:
      'Meningkatkan ATK seluruh anggota party sebesar 312 dan CRIT DMG 10% selama 300 detik.',
    prepMinutes: 15,
    ingredients: [
      { name: 'Raw Meat', count: 4, icon: `${ING_CDN}UI_ItemIcon_100061.png` },
      { name: 'Spice', count: 2, icon: `${ING_CDN}UI_ItemIcon_110014.png` },
      { name: 'Tomato', count: 2, icon: `${ING_CDN}UI_ItemIcon_100079.png` },
      { name: 'Cheese', count: 2, icon: `${ING_CDN}UI_ItemIcon_110009.png` },
    ],
  },
  {
    id: 3103,
    name: 'Golden Shrimp Balls',
    rarity: 3,
    category: 'Snacks',
    region: 'Liyue',
    buffType: 'HP',
    buffLabel: 'Revive +1500 HP',
    priceMora: 5200,
    image: '/assets/dishes/golden_shrimp_balls.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108126.png',
    description:
      'Udang segar dibalut helaian kentang renyah keemasan yang digoreng hingga kering sempurna. Teksturnya garing di luar namun tetap manis dan lembut di bagian dalam.',
    effect:
      'Membangkitkan satu karakter yang gugur dan memulihkan 1.500 HP secara instan.',
    prepMinutes: 10,
    ingredients: [
      { name: 'Shrimp Meat', count: 5, icon: `${ING_CDN}UI_ItemIcon_100093.png` },
      { name: 'Potato', count: 4, icon: `${ING_CDN}UI_ItemIcon_100080.png` },
      { name: 'Flour', count: 3, icon: `${ING_CDN}UI_ItemIcon_110001.png` },
    ],
  },
  {
    id: 3104,
    name: 'Barbatos Ratatouille',
    rarity: 3,
    category: 'Main Dish',
    region: 'Mondstadt',
    buffType: 'STAMINA',
    buffLabel: 'Stamina -25%',
    priceMora: 5500,
    image: '/assets/dishes/barbatos_ratatouille.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108111.png',
    description:
      'Semur sayuran sederhana namun penuh sejarah dari tanah kebebasan Mondstadt. Hangatnya kuah bawang dan wortel memberi napas panjang bagi para petualang yang menjelajah tebing tinggi.',
    effect:
      'Mengurangi konsumsi Stamina saat berlari dan meluncur (gliding) sebesar 25% selama 900 detik.',
    prepMinutes: 12,
    ingredients: [
      { name: 'Carrot', count: 4, icon: `${ING_CDN}UI_ItemIcon_100013.png` },
      { name: 'Potato', count: 4, icon: `${ING_CDN}UI_ItemIcon_100080.png` },
      { name: 'Onion', count: 4, icon: `${ING_CDN}UI_ItemIcon_100076.png` },
    ],
  },
  {
    id: 2105,
    name: 'Sweet Madame',
    rarity: 2,
    category: 'Main Dish',
    region: 'Mondstadt',
    buffType: 'HP',
    buffLabel: 'HP +24%',
    priceMora: 3200,
    image: '/assets/dishes/sweet_madame.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108115.png',
    description:
      'Unggas panggang berlumur madu bunga manis yang renyah dan harum. Hidangan andalan para petualang Mondstadt untuk memulihkan tenaga setelah ekspedisi panjang.',
    effect:
      'Memulihkan 24% Max HP dan tambahan 1.500 HP untuk karakter yang dipilih.',
    prepMinutes: 9,
    ingredients: [
      { name: 'Fowl', count: 2, icon: `${ING_CDN}UI_ItemIcon_100064.png` },
      { name: 'Sweet Flower', count: 2, icon: `${ING_CDN}UI_ItemIcon_100012.png` },
    ],
  },
  {
    id: 3106,
    name: 'Mushroom Pizza',
    rarity: 3,
    category: 'Main Dish',
    region: 'Mondstadt',
    buffType: 'HP',
    buffLabel: 'HP +30% + Regen',
    priceMora: 6000,
    image: '/assets/dishes/mushroom_pizza.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108112.png',
    description:
      'Roti panggang renyah berbalut keju leleh kental dan potongan jamur hutan segar. Disajikan hangat langsung dari tungku Good Hunter di pusat Kota Mondstadt.',
    effect:
      'Memulihkan 30% Max HP serta memulihkan 790 HP tambahan setiap 5 detik selama 30 detik.',
    prepMinutes: 13,
    ingredients: [
      { name: 'Mushroom', count: 4, icon: `${ING_CDN}UI_ItemIcon_100011.png` },
      { name: 'Flour', count: 3, icon: `${ING_CDN}UI_ItemIcon_110001.png` },
      { name: 'Cabbage', count: 2, icon: `${ING_CDN}UI_ItemIcon_100018.png` },
      { name: 'Cheese', count: 1, icon: `${ING_CDN}UI_ItemIcon_110009.png` },
    ],
  },
  {
    id: 3107,
    name: 'Tonkotsu Ramen',
    rarity: 3,
    category: 'Main Dish',
    region: 'Inazuma',
    buffType: 'HP',
    buffLabel: 'HP +34%',
    priceMora: 6400,
    image: '/assets/dishes/tonkotsu_ramen.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108249.png',
    description:
      'Mie kenyal Inazuma yang tenggelam dalam kaldu tulang kental gurih dengan irisan daging lembut dan telur rebus setengah matang. Mengusir dinginnya angin malam Hanamizaka.',
    effect:
      'Memulihkan 34% Max HP dan tambahan 1.900 HP untuk karakter yang dipilih.',
    prepMinutes: 12,
    ingredients: [
      { name: 'Raw Meat', count: 4, icon: `${ING_CDN}UI_ItemIcon_100061.png` },
      { name: 'Flour', count: 3, icon: `${ING_CDN}UI_ItemIcon_110001.png` },
      { name: 'Bamboo Shoot', count: 2, icon: `${ING_CDN}UI_ItemIcon_100091.png` },
      { name: 'Bird Egg', count: 1, icon: `${ING_CDN}UI_ItemIcon_100062.png` },
    ],
  },
  {
    id: 3108,
    name: 'Tri-Color Dango',
    rarity: 3,
    category: 'Snacks',
    region: 'Inazuma',
    buffType: 'HP',
    buffLabel: 'HP +32%',
    priceMora: 4800,
    image: '/assets/dishes/tri_color_dango.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108251.png',
    description:
      'Tiga bola mochi kenyal berwarna kelopak sakura, krim susu, dan daun teh muda yang ditusuk rapi. Cemilan wajib sembari berjalan santai di bawah pohon Sacred Sakura.',
    effect:
      'Memulihkan 32% Max HP dan tambahan 1.250 HP secara lembut tanpa membebani perut.',
    prepMinutes: 7,
    ingredients: [
      { name: 'Milk', count: 2, icon: `${ING_CDN}UI_ItemIcon_100078.png` },
      { name: 'Snapdragon', count: 2, icon: `${ING_CDN}UI_ItemIcon_100015.png` },
      { name: 'Sakura Bloom', count: 2, icon: `${ING_CDN}UI_ItemIcon_101202.png` },
      { name: 'Rice', count: 1, icon: `${ING_CDN}UI_ItemIcon_100092.png` },
    ],
  },
  {
    id: 2109,
    name: 'Almond Tofu',
    rarity: 2,
    category: 'Snacks',
    region: 'Liyue',
    buffType: 'ATK',
    buffLabel: 'ATK +95',
    priceMora: 3600,
    image: '/assets/dishes/almond_tofu.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108098.png',
    description:
      'Puding sutra beraroma kacang almond lembut yang disajikan dingin dengan sirup manis ringan. Hidangan penutup favorit dari Penginapan Wangshu yang menenangkan pikiran.',
    effect:
      'Meningkatkan ATK seluruh anggota party sebesar 95 selama 300 detik.',
    prepMinutes: 6,
    ingredients: [
      { name: 'Milk', count: 3, icon: `${ING_CDN}UI_ItemIcon_100078.png` },
      { name: 'Sugar', count: 1, icon: `${ING_CDN}UI_ItemIcon_110006.png` },
      { name: 'Almond', count: 1, icon: `${ING_CDN}UI_ItemIcon_100089.png` },
    ],
  },
  {
    id: 2110,
    name: 'Shawarma Wrap',
    rarity: 2,
    category: 'Snacks',
    region: 'Sumeru',
    buffType: 'ATK',
    buffLabel: 'ATK +95',
    priceMora: 3800,
    image: '/assets/dishes/shawarma_wrap.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108398.png',
    description:
      'Daging panggang rempah khas Grand Bazaar Sumeru yang diiris tipis dan digulung bersama saus lembut di dalam roti pipih hangat. Praktis disantap para peneliti Akademiya.',
    effect:
      'Meningkatkan ATK seluruh anggota party sebesar 95 selama 300 detik.',
    prepMinutes: 8,
    ingredients: [
      { name: 'Raw Meat', count: 2, icon: `${ING_CDN}UI_ItemIcon_100061.png` },
      { name: 'Flour', count: 2, icon: `${ING_CDN}UI_ItemIcon_110001.png` },
      { name: 'Spice', count: 1, icon: `${ING_CDN}UI_ItemIcon_110014.png` },
    ],
  },
  {
    id: 2111,
    name: "Fisherman's Toast",
    rarity: 2,
    category: 'Snacks',
    region: 'Mondstadt',
    buffType: 'DEF',
    buffLabel: 'DEF +126',
    priceMora: 2900,
    image: '/assets/dishes/fishermans_toast.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108005.png',
    description:
      'Roti panggang keemasan bertabur irisan bawang manis, tomat segar, dan olesan mentega hangat. Bekal sederhana yang tak pernah absen di tepian Danau Cider.',
    effect:
      'Meningkatkan DEF seluruh anggota party sebesar 126 selama 300 detik.',
    prepMinutes: 6,
    ingredients: [
      { name: 'Flour', count: 3, icon: `${ING_CDN}UI_ItemIcon_110001.png` },
      { name: 'Tomato', count: 2, icon: `${ING_CDN}UI_ItemIcon_100079.png` },
      { name: 'Onion', count: 1, icon: `${ING_CDN}UI_ItemIcon_100076.png` },
      { name: 'Milk', count: 1, icon: `${ING_CDN}UI_ItemIcon_100078.png` },
    ],
  },
  {
    id: 2112,
    name: 'Matsutake Meat Rolls',
    rarity: 2,
    category: 'Main Dish',
    region: 'Liyue',
    buffType: 'HP',
    buffLabel: 'HP +24%',
    priceMora: 3400,
    image: '/assets/dishes/matsutake_meat_rolls.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108025.png',
    description:
      'Daging cincang gurih yang membungkus jamur Matsutake harum lalu dipanggang hingga sari kaldunya menyatu sempurna di setiap potongan.',
    effect:
      'Memulihkan 24% Max HP dan tambahan 1.500 HP untuk satu karakter.',
    prepMinutes: 10,
    ingredients: [
      { name: 'Matsutake', count: 2, icon: `${ING_CDN}UI_ItemIcon_100063.png` },
      { name: 'Raw Meat', count: 2, icon: `${ING_CDN}UI_ItemIcon_100061.png` },
    ],
  },
  {
    id: 2113,
    name: 'Dango Milk',
    rarity: 2,
    category: 'Beverages',
    region: 'Inazuma',
    buffType: 'HP',
    buffLabel: 'HP +26% + Regen',
    priceMora: 2800,
    image: '/assets/dishes/dango_milk.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_101514.png',
    description:
      'Minuman susu manis khas kedai Tomoki di Kota Inazuma yang memadukan butiran dango lembut dengan krim segar. Menjadi minuman kesayangan sang Raiden Shogun.',
    effect:
      'Memulihkan 26% Max HP dan 570 HP setiap 5 detik selama 30 detik.',
    prepMinutes: 5,
    ingredients: [
      { name: 'Milk', count: 2, icon: `${ING_CDN}UI_ItemIcon_100078.png` },
      { name: 'Rice', count: 2, icon: `${ING_CDN}UI_ItemIcon_100092.png` },
      { name: 'Sugar', count: 1, icon: `${ING_CDN}UI_ItemIcon_110006.png` },
    ],
  },
  {
    id: 2114,
    name: 'Fonta',
    rarity: 2,
    category: 'Beverages',
    region: 'Fontaine',
    buffType: 'STAMINA',
    buffLabel: 'Stamina +60',
    priceMora: 2400,
    image: '/assets/dishes/fonta.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108543.png',
    description:
      'Minuman bersoda dingin menyegarkan produksi Court of Fontaine dengan rasa buah cerah dan sensasi karbonasi tajam yang membangkitkan semangat penjelajah.',
    effect:
      'Memulihkan 60 poin Stamina secara instan dan menyegarkan stamina berenang.',
    prepMinutes: 4,
    ingredients: [
      { name: 'Bulle Fruit', count: 2, icon: `${ING_CDN}UI_ItemIcon_101230.png` },
      { name: 'Sugar', count: 1, icon: `${ING_CDN}UI_ItemIcon_110006.png` },
    ],
  },
  {
    id: 3115,
    name: 'Apple Cider',
    rarity: 3,
    category: 'Beverages',
    region: 'Mondstadt',
    buffType: 'HP',
    buffLabel: 'HP +26% + Regen',
    priceMora: 3100,
    image: '/assets/dishes/apple_cider.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_100001.png',
    description:
      'Sari apel perasan dingin non-alkohol dari kebun Dawn Winery yang manis dan renyah. Sempurna diminum di teras Angel Share pada sore hari.',
    effect:
      'Memulihkan 26% Max HP serta memulihkan 570 HP setiap 5 detik selama 30 detik.',
    prepMinutes: 4,
    ingredients: [
      { name: 'Apple', count: 3, icon: `${ING_CDN}UI_ItemIcon_100001.png` },
      { name: 'Sugar', count: 1, icon: `${ING_CDN}UI_ItemIcon_110006.png` },
    ],
  },
  {
    id: 3117,
    name: 'Moonlit Frostberry Tart',
    rarity: 3,
    category: 'Snacks',
    region: 'Nod-Krai',
    buffType: 'DEF',
    buffLabel: 'DEF +235',
    priceMora: 5900,
    image: '/assets/dishes/fishermans_toast.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108556.png',
    description:
      'Kue tart mentega hangat bertabur buah beri salju langka dari perbatasan utara Nod-Krai. Krim rempahnya menjaga daya tahan tubuh di tengah angin dingin perbatasan.',
    effect:
      'Meningkatkan DEF seluruh anggota party sebesar 235 dan kekuatan Perisai sebesar 15% selama 300 detik.',
    prepMinutes: 11,
    ingredients: [
      { name: 'Berry', count: 4, icon: `${ING_CDN}UI_ItemIcon_100051.png` },
      { name: 'Flour', count: 3, icon: `${ING_CDN}UI_ItemIcon_110001.png` },
      { name: 'Butter', count: 2, icon: `${ING_CDN}UI_ItemIcon_110004.png` },
    ],
  },
  {
    id: 1118,
    name: 'Tundra Honey Mead',
    rarity: 1,
    category: 'Beverages',
    region: 'Snezhnaya',
    buffType: 'DEF',
    buffLabel: 'DEF +110',
    priceMora: 2100,
    image: '/assets/dishes/apple_cider.png',
    fallbackImage: 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_108351.png',
    description:
      'Seduhan madu bunga salju hangat ala kedai utara Snezhnaya yang manis menenangkan. Menghangatkan telapak tangan dan memperkuat ketahanan dari hawa beku.',
    effect:
      'Meningkatkan DEF seluruh anggota party sebesar 110 dan memperlambat akumulasi hawa dingin selama 300 detik.',
    prepMinutes: 5,
    ingredients: [
      { name: 'Sweet Flower', count: 2, icon: `${ING_CDN}UI_ItemIcon_100012.png` },
      { name: 'Berry', count: 2, icon: `${ING_CDN}UI_ItemIcon_100051.png` },
    ],
  },
];

export const TOP_RECOMMENDATION_IDS = [5101, 4102, 4116, 3107, 3104];

export const COUPONS: Coupon[] = [
  {
    code: 'PAIMONKENYANG',
    type: 'PERCENT',
    value: 20,
    title: 'Voucher Paimon Kenyang',
    description: 'Potongan 20% untuk seluruh subtotal pesanan kuliner Teyvat.',
    icon: '/assets/icons/intertwined_fate.png',
  },
  {
    code: 'FRAGILERESIN',
    type: 'FREE_DELIVERY',
    value: 500,
    title: 'Glider Kilat Gratis Ongkir',
    description: 'Membebaskan biaya pengantaran Kurir Glider (500 Mora).',
    icon: '/assets/icons/fragile_resin.png',
  },
];

export const WANMIN_ORIGIN_COORDS = { x: 75, y: 45 };

export const DELIVERY_POINTS: DeliveryPoint[] = [
  {
    id: 'favonius-hq',
    name: 'Knights of Favonius HQ',
    region: 'Mondstadt',
    landmark: 'Gerbang Utama Markas Besar · Dekat Patung Barbatos',
    etaMinutes: 15,
    mapCoords: { x: 86, y: 55 },
  },
  {
    id: 'wanmin-terrace',
    name: 'Wanmin Restaurant Terrace',
    region: 'Liyue',
    landmark: 'Pelabuhan Chihu Rock · Meja Lentera Chef Xiangling',
    etaMinutes: 12,
    mapCoords: { x: 75, y: 45 },
  },
  {
    id: 'narukami-shrine',
    name: 'Grand Narukami Shrine',
    region: 'Inazuma',
    landmark: 'Puncak Mt. Yougou · Dekat Pohon Sacred Sakura',
    etaMinutes: 18,
    mapCoords: { x: 91, y: 24 },
  },
  {
    id: 'maison-cardinalice',
    name: 'Court of Fontaine',
    region: 'Fontaine',
    landmark: 'Maison Cardinalice · Palais Mermonia Plaza',
    etaMinutes: 16,
    mapCoords: { x: 59, y: 54 },
  },
  {
    id: 'akademiya-courtyard',
    name: 'Akademiya Courtyard',
    region: 'Sumeru',
    landmark: 'Gerbang Sanctuary of Surasthana · Jalur Rampai',
    etaMinutes: 15,
    mapCoords: { x: 63, y: 35 },
  },
  {
    id: 'tequemecan-springs',
    name: 'Tequemecan Springs',
    region: 'Natlan',
    landmark: 'Stadium of the Sacred Flame · Teras Api Abadi',
    etaMinutes: 17,
    mapCoords: { x: 21, y: 24 },
  },
];

export const NAMECARDS: Namecard[] = [
  {
    id: 'natlan_saurian',
    name: 'Natlan · Divine Flame',
    region: 'Natlan',
    subtitle: 'Kehormatan Stadium of the Sacred Flame',
    bgImage: '/assets/namecards/natlan_saurian_bg.png',
    iconImage: '/assets/namecards/natlan_saurian_icon.png',
  },
  {
    id: 'furina_fountain',
    name: 'Furina · Banquet',
    region: 'Fontaine',
    subtitle: 'Simfoni Panggung Opera Epiclese',
    bgImage: '/assets/namecards/furina_fountain_bg.png',
    iconImage: '/assets/namecards/furina_fountain_icon.png',
  },
  {
    id: 'fontaine_glory',
    name: 'Fontaine · Completeness',
    region: 'Fontaine',
    subtitle: 'Panji Kemegahan Court of Fontaine',
    bgImage: '/assets/namecards/fontaine_glory_bg.png',
    iconImage: '/assets/namecards/fontaine_glory_icon.png',
  },
  {
    id: 'nahida_dendro',
    name: 'Nahida · Crescent',
    region: 'Sumeru',
    subtitle: 'Kebijaksanaan Sanctuary of Surasthana',
    bgImage: '/assets/namecards/nahida_dendro_bg.png',
    iconImage: '/assets/namecards/nahida_dendro_icon.png',
  },
  {
    id: 'raiden_shogun',
    name: 'Raiden Shogun · Enlightenment',
    region: 'Inazuma',
    subtitle: 'Keabadian Petir Pulau Narukami',
    bgImage: '/assets/namecards/raiden_shogun_bg.png',
    iconImage: '/assets/namecards/raiden_shogun_icon.png',
  },
  {
    id: 'zhongli_rex',
    name: 'Zhongli · Planet Befall',
    region: 'Liyue',
    subtitle: 'Kontrak Abadi Geo Archon',
    bgImage: '/assets/namecards/zhongli_rex_bg.png',
    iconImage: '/assets/namecards/zhongli_rex_icon.png',
  },
  {
    id: 'liyue_harbor',
    name: 'Liyue · Stillness of Stone',
    region: 'Liyue',
    subtitle: 'Lentera Pelabuhan Chihu Rock',
    bgImage: '/assets/namecards/liyue_harbor_bg.png',
    iconImage: '/assets/namecards/liyue_harbor_bg.png',
  },
  {
    id: 'mondstadt_favonius',
    name: 'Mondstadt · Hero\'s Fame',
    region: 'Mondstadt',
    subtitle: 'Kebebasan Angin Knights of Favonius',
    bgImage: '/assets/namecards/mondstadt_favonius_bg.png',
    iconImage: '/assets/namecards/mondstadt_favonius_bg.png',
  },
];

export const INITIAL_PROFILE: TravelerProfile = {
  uid: '14524303',
  username: 'Badar Rahman',
  adventureRank: 60,
  worldLevel: 8,
  moraBalance: 1452430,
  primogemBalance: 1600,
  reputationTitle: 'Honorary Knight · Favonius Lv. 10',
  reputationRegion: 'Mondstadt',
  avatarUrl: 'https://enka.network/ui/UI_AvatarIcon_PlayerGirl.png',
  fallbackAvatarUrl: '/assets/icons/crown_of_insight.png',
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-TEYVAT-7708',
    items: [
      { dish: DISHES[0], quantity: 1 },
      { dish: DISHES[8], quantity: 2 },
    ],
    subtotalMora: 22100,
    deliveryFeeMora: 500,
    discountMora: 4420,
    totalMora: 18180,
    couponCode: 'PAIMONKENYANG',
    deliveryPoint: DELIVERY_POINTS[0],
    paymentMethod: 'NORTHLAND_BANK_CARD',
    kitchenNotes: 'Kurangi Jueyun Chili agar Paimon bisa ikut mencicipi.',
    status: 'COMPLETED',
    createdAt: '22 Nov 2026 · 19:42',
  },
  {
    id: 'ORD-TEYVAT-7694',
    items: [
      { dish: DISHES[7], quantity: 2 },
      { dish: DISHES[13], quantity: 2 },
    ],
    subtotalMora: 18400,
    deliveryFeeMora: 0,
    discountMora: 500,
    totalMora: 18400,
    couponCode: 'FRAGILERESIN',
    deliveryPoint: DELIVERY_POINTS[2],
    paymentMethod: 'MORA_COD',
    kitchenNotes: 'Kuah ramen dipisah agar tetap panas saat glider mendarat.',
    status: 'COMPLETED',
    createdAt: '20 Nov 2026 · 13:15',
  },
];

export const DELIVERY_FEE_MORA = 500;

export function formatMora(amount: number): string {
  return new Intl.NumberFormat('en-US').format(Math.max(0, Math.round(amount)));
}
