import React, { useState } from 'react';
import {
  Compass,
  ShoppingBag,
  User,
  UtensilsCrossed,
  Search,
  Plus,
  Minus,
  Trash2,
  X,
  Volume2,
  VolumeX,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Heart,
  Sword,
  Tag,
  Globe
} from 'lucide-react';
import { DISHES_DATA } from './data/dishes';
import { Dish, CartItem, TeyvatRegion, BuffType } from './types';

export default function App() {
  // Navigation State
  const [inEntrance, setInEntrance] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'catalog' | 'explore' | 'cart' | 'profile'>('catalog');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBuff, setSelectedBuff] = useState<BuffType | 'ALL'>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<TeyvatRegion | 'ALL'>('ALL');

  // Cart & Wallet
  const [cart, setCart] = useState<CartItem[]>([
    { dish: DISHES_DATA[0], quantity: 1 },
    { dish: DISHES_DATA[5], quantity: 2 },
  ]);
  const [moraBalance, setMoraBalance] = useState<number>(1452430);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string>('');

  // Audio & Modals
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [selectedDishModal, setSelectedDishModal] = useState<Dish | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [showQuestComplete, setShowQuestComplete] = useState<boolean>(false);
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Knights of Favonius HQ');
  const [paymentMethod, setPaymentMethod] = useState<'MORA' | 'NORTHLAND'>('MORA');
  const [lang, setLang] = useState<'ID' | 'EN'>('ID');

  // Cart Helpers
  const addToCart = (dish: Dish, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.dish.id === dish.id);
      if (existing) {
        return prev.map(item =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { dish, quantity: qty }];
    });
  };

  const updateCartQty = (dishId: number, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (dishId: number) => {
    setCart(prev => prev.filter(item => item.dish.id !== dishId));
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalMora = cart.reduce((sum, item) => sum + item.dish.priceMora * item.quantity, 0);
  const courierFeeMora = subtotalMora > 0 ? 500 : 0;
  const discountMora = Math.round((subtotalMora * discountPercent) / 100);
  const finalTotalMora = Math.max(0, subtotalMora + courierFeeMora - discountMora);

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'PAIMONKENYANG') {
      setDiscountPercent(20);
      setCouponMessage(lang === 'ID' ? 'Kupon Berhasil: Diskon 20% Mora!' : 'Coupon Applied: 20% Mora Off!');
    } else {
      setCouponMessage(lang === 'ID' ? 'Kode tidak valid' : 'Invalid coupon code');
    }
  };

  const confirmOrder = () => {
    if (moraBalance < finalTotalMora) {
      alert(lang === 'ID' ? 'Saldo Mora tidak cukup!' : 'Insufficient Mora balance!');
      return;
    }
    setMoraBalance(prev => prev - finalTotalMora);
    setCart([]);
    setShowCheckoutModal(false);
    setShowQuestComplete(true);
  };

  // Filter Dishes
  const filteredDishes = DISHES_DATA.filter(dish => {
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.effect.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesBuff = selectedBuff === 'ALL' || dish.buffType === selectedBuff;
    const matchesRegion = selectedRegion === 'ALL' || dish.region === selectedRegion;
    return matchesSearch && matchesCategory && matchesBuff && matchesRegion;
  });

  const getRarityBg = (rarity: number) => {
    switch (rarity) {
      case 5: return 'bg-gradient-to-r from-[#9C5818] to-[#C87C24]';
      case 4: return 'bg-gradient-to-r from-[#69488E] to-[#9470BB]';
      case 3: return 'bg-gradient-to-r from-[#3B668B] to-[#5987AD]';
      case 2: return 'bg-gradient-to-r from-[#396F57] to-[#5A977A]';
      default: return 'bg-gradient-to-r from-[#5E6163] to-[#818486]';
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0C18] flex items-center justify-center p-0 sm:p-4 text-slate-100">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] bg-[#171421] sm:rounded-[36px] sm:border-[3px] sm:border-[#5D5187]/60 shadow-2xl overflow-hidden flex flex-col relative">

        {/* 0. Celestia Gate Entrance Screen */}
        {inEntrance ? (
          <div className="relative w-full h-full flex flex-col justify-between items-center p-6 text-center select-none overflow-hidden bg-cover bg-center"
               style={{ backgroundImage: `url('https://images8.alphacoders.com/134/1342645.png')` }}>
            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#171421]/60 via-transparent to-[#120F1D]/90 pointer-events-none" />

            {/* Audio Toggle Top-Right */}
            <div className="w-full flex justify-end relative z-10 pt-4">
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="w-10 h-10 rounded-full bg-[#1D1A2A]/80 border border-[#FFE7A5]/50 flex items-center justify-center text-[#FFE7A5] hover:scale-105 transition"
              >
                {isAudioMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>

            {/* Center Titles */}
            <div className="relative z-10 flex flex-col items-center mt-16">
              <div className="px-3 py-1 rounded-full bg-[#FFE7A5]/20 border border-[#FFE7A5]/40 text-[#FFE7A5] text-[11px] font-semibold tracking-widest uppercase mb-3">
                Official Teyvat Feast Service
              </div>
              <h1 className="text-3xl font-extrabold text-[#FFE7A5] tracking-wider drop-shadow-lg font-genshin">
                TEYVAT DELICACIES
              </h1>
              <p className="text-xs text-slate-200 mt-2 max-w-[260px] leading-relaxed drop-shadow">
                {lang === 'ID'
                  ? 'Layanan Kuliner 8 Bangsa Teyvat — Pemrograman Visual I (TI361)'
                  : 'Culinary Delivery across the 8 Nations of Teyvat — Visual Programming I'}
              </p>
            </div>

            {/* Tap to Enter Bottom Button */}
            <div className="relative z-10 w-full mb-8 flex flex-col items-center">
              <button
                onClick={() => setInEntrance(false)}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#ECE5D8] via-[#D3BC8E] to-[#ECE5D8] text-[#1D1A2A] font-bold text-sm tracking-wider shadow-lg border border-[#FFE7A5] hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 animate-pulse"
              >
                <span>{lang === 'ID' ? 'SENTUH UNTUK MEMULAI' : 'TAP TO ENTER TEYVAT'}</span>
                <ArrowRight size={18} />
              </button>
              <span className="text-[10px] text-slate-300 mt-3 opacity-80">
                Badar Rahman • NIM 14524303 • STIKOM Poltek Cirebon
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Header Status Bar */}
            <header className="bg-[#1D1A2A] border-b border-[#5D5187]/40 px-4 py-3 flex items-center justify-between z-10 shrink-0">
              {/* Traveler Avatar */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full border border-[#FFE7A5] overflow-hidden bg-slate-800 shrink-0">
                  <img
                    src="https://enka.network/ui/UI_AvatarIcon_PlayerBoy.png"
                    alt="Traveler"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200 leading-tight">Badar Rahman</div>
                  <div className="text-[10px] text-[#FFE7A5] font-semibold">AR 60 • WL 8</div>
                </div>
              </div>

              {/* Mora Balance & Lang */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLang(l => (l === 'ID' ? 'EN' : 'ID'))}
                  className="px-2 py-1 rounded bg-[#272338] border border-[#5D5187]/60 text-[10px] text-[#FFE7A5] flex items-center gap-1"
                >
                  <Globe size={11} />
                  <span>{lang}</span>
                </button>
                <div className="flex items-center gap-1.5 bg-[#120F1D] px-2.5 py-1 rounded-full border border-[#FFE7A5]/40">
                  <img src="https://enka.network/ui/UI_ItemIcon_202.png" alt="Mora" className="w-4 h-4 object-contain" />
                  <span className="text-xs font-bold text-[#FFE7A5]">{moraBalance.toLocaleString()}</span>
                </div>
              </div>
            </header>

            {/* Scrollable Content Body */}
            <main className="flex-1 overflow-y-auto pb-24">
              {/* 1. CATALOG TAB */}
              {activeTab === 'catalog' && (
                <div className="p-4 space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-[#5D5187]" size={16} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder={lang === 'ID' ? 'Cari masakan atau efek buff...' : 'Search cuisines or buffs...'}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F5F2EB] text-[#1D1A2A] text-xs placeholder-[#4A5366]/60 border border-[#D3BC8E] focus:outline-none focus:ring-1 focus:ring-[#FFE7A5]"
                    />
                  </div>

                  {/* Horizontal Category Chips */}
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {['All', 'Main Dish', 'Snacks', 'Beverages'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                          selectedCategory === cat
                            ? 'bg-[#FFE7A5] text-[#1D1A2A] shadow'
                            : 'bg-[#272338] text-slate-300 border border-[#5D5187]/40 hover:bg-[#312B47]'
                        }`}
                      >
                        {cat === 'All' ? (lang === 'ID' ? 'Semua Menu' : 'All Menu') : cat}
                      </button>
                    ))}
                  </div>

                  {/* Two-Tone Food Card Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {filteredDishes.map(dish => (
                      <div
                        key={dish.id}
                        onClick={() => {
                          setSelectedDishModal(dish);
                          setModalQuantity(1);
                        }}
                        className="rounded-2xl overflow-hidden border border-[#5D5187]/50 shadow cursor-pointer hover:border-[#FFE7A5]/80 transition flex flex-col bg-[#E9E5DC] text-[#1D1A2A] group"
                      >
                        {/* Top Rarity Header & Dish Image */}
                        <div className={`h-24 relative p-2 flex items-end justify-between ${getRarityBg(dish.rarity)}`}>
                          <span className="text-[11px] font-bold text-white/90 drop-shadow flex items-center gap-0.5">
                            {'★'.repeat(dish.rarity)}
                          </span>
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="absolute -right-2 -bottom-2 w-20 h-20 object-contain drop-shadow-md group-hover:scale-105 transition"
                          />
                        </div>

                        {/* Bottom Parchment Body */}
                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-[10px] text-[#5D5187] font-semibold uppercase">{dish.region}</div>
                            <h3 className="text-xs font-bold font-genshin text-[#1D1A2A] leading-tight line-clamp-1 mt-0.5">
                              {dish.name}
                            </h3>
                            <div className="inline-block mt-1 px-1.5 py-0.5 rounded bg-[#F5F2EB] text-[9px] text-[#4A5366] font-medium border border-[#D3BC8E]/60 line-clamp-1">
                              {dish.buffLabel}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-[#D3BC8E]/40">
                            <div className="flex items-center gap-1">
                              <img src="https://enka.network/ui/UI_ItemIcon_202.png" alt="Mora" className="w-3.5 h-3.5" />
                              <span className="text-xs font-extrabold text-[#9C5818]">{dish.priceMora.toLocaleString()}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(dish, 1);
                              }}
                              className="w-6 h-6 rounded-full bg-[#1D1A2A] text-[#FFE7A5] flex items-center justify-center hover:bg-[#312B47] transition shadow"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. EXPLORE & BUFF TAB */}
              {activeTab === 'explore' && (
                <div className="p-4 space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#FFE7A5] font-genshin tracking-wide">
                      {lang === 'ID' ? 'Filter Khasiat Efek Buff' : 'Combat Buff Filters'}
                    </h2>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {lang === 'ID' ? 'Tingkatkan status tempur karakter sebelum bertualang' : 'Boost team combat stats'}
                    </p>
                  </div>

                  {/* Buff Filter Chips */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'ALL', label: 'Semua Efek', icon: Sparkles },
                      { type: 'ATK', label: 'ATK Boost', icon: Sword },
                      { type: 'DEF', label: 'DEF Boost', icon: Shield },
                      { type: 'HP', label: 'HP Recovery', icon: Heart },
                      { type: 'STAMINA', label: 'Stamina', icon: Zap },
                    ].map(item => (
                      <button
                        key={item.type}
                        onClick={() => setSelectedBuff(item.type as any)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition ${
                          selectedBuff === item.type
                            ? 'bg-[#FFE7A5] text-[#1D1A2A] border-[#FFE7A5]'
                            : 'bg-[#272338] text-slate-300 border-[#5D5187]/50 hover:bg-[#312B47]'
                        }`}
                      >
                        <item.icon size={15} />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Region Filter */}
                  <div className="pt-2">
                    <h3 className="text-xs font-bold text-[#FFE7A5] mb-2">
                      {lang === 'ID' ? 'Bangsa / Region Teyvat' : 'Teyvat Nations'}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {['ALL', 'Mondstadt', 'Liyue', 'Inazuma', 'Sumeru', 'Fontaine', 'Natlan', 'Nod-Krai', 'Snezhnaya'].map(reg => (
                        <button
                          key={reg}
                          onClick={() => setSelectedRegion(reg as any)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition ${
                            selectedRegion === reg
                              ? 'bg-[#5D5187] text-white border border-[#FFE7A5]'
                              : 'bg-[#1D1A2A] text-slate-300 border border-[#5D5187]/40'
                          }`}
                        >
                          {reg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filtered Results Count */}
                  <div className="text-xs text-slate-400 pt-1">
                    {lang === 'ID' ? `Ditemukan ${filteredDishes.length} menu sesuai kriteria` : `Found ${filteredDishes.length} dishes`}
                  </div>
                </div>
              )}

              {/* 3. CART TAB */}
              {activeTab === 'cart' && (
                <div className="p-4 space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#FFE7A5] font-genshin">
                      {lang === 'ID' ? 'Tas Belanja Petualang' : "Traveler's Cart"}
                    </h2>
                    <p className="text-[11px] text-slate-300">{totalCartItems} {lang === 'ID' ? 'masakan siap santap' : 'items selected'}</p>
                  </div>

                  {cart.length === 0 ? (
                    <div className="p-8 text-center bg-[#272338]/60 rounded-2xl border border-[#5D5187]/40 mt-6">
                      <ShoppingBag className="mx-auto text-[#5D5187] mb-2" size={32} />
                      <div className="text-xs font-semibold text-slate-200">
                        {lang === 'ID' ? 'Tas belanja Anda masih kosong' : 'Your cart is empty'}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {lang === 'ID' ? 'Buka katalog untuk memilih santapan lezat Teyvat' : 'Browse the catalog to add meals'}
                      </p>
                      <button
                        onClick={() => setActiveTab('catalog')}
                        className="mt-4 px-4 py-2 rounded-xl bg-[#FFE7A5] text-[#1D1A2A] text-xs font-bold"
                      >
                        {lang === 'ID' ? 'Buka Katalog' : 'Open Catalog'}
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Cart Item Cards */}
                      <div className="space-y-2">
                        {cart.map(item => (
                          <div
                            key={item.dish.id}
                            className="p-2.5 rounded-xl bg-[#E9E5DC] text-[#1D1A2A] border border-[#D3BC8E] flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2.5">
                              <img src={item.dish.image} alt={item.dish.name} className="w-12 h-12 object-contain" />
                              <div>
                                <h4 className="text-xs font-bold font-genshin leading-tight">{item.dish.name}</h4>
                                <div className="text-[10px] text-[#9C5818] font-bold mt-0.5">
                                  {item.dish.priceMora.toLocaleString()} Mora
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center bg-[#F5F2EB] rounded-lg border border-[#D3BC8E] px-1 py-0.5">
                                <button
                                  onClick={() => updateCartQty(item.dish.id, -1)}
                                  className="w-5 h-5 flex items-center justify-center text-[#1D1A2A]"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQty(item.dish.id, 1)}
                                  className="w-5 h-5 flex items-center justify-center text-[#1D1A2A]"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.dish.id)}
                                className="text-red-700 p-1 hover:text-red-900"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Coupon Section */}
                      <div className="p-3 rounded-xl bg-[#272338] border border-[#5D5187]/60 space-y-2">
                        <label className="text-[11px] font-bold text-[#FFE7A5] flex items-center gap-1.5">
                          <Tag size={13} />
                          <span>{lang === 'ID' ? 'Kupon Intertwined Fate' : 'Discount Coupon'}</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={e => setCouponCode(e.target.value)}
                            placeholder="Kode: PAIMONKENYANG"
                            className="flex-1 px-3 py-1.5 rounded-lg bg-[#1D1A2A] text-xs text-slate-100 border border-[#5D5187] focus:outline-none"
                          />
                          <button
                            onClick={applyCoupon}
                            className="px-3 py-1.5 rounded-lg bg-[#FFE7A5] text-[#1D1A2A] text-xs font-bold"
                          >
                            {lang === 'ID' ? 'Pakai' : 'Apply'}
                          </button>
                        </div>
                        {couponMessage && (
                          <div className={`text-[10px] font-semibold ${discountPercent > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {couponMessage}
                          </div>
                        )}
                      </div>

                      {/* Billing Summary */}
                      <div className="p-3.5 rounded-xl bg-[#272338] border border-[#5D5187]/60 space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>Subtotal Menu</span>
                          <span>{subtotalMora.toLocaleString()} Mora</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Ongkir Kurir Glider</span>
                          <span>{courierFeeMora.toLocaleString()} Mora</span>
                        </div>
                        {discountPercent > 0 && (
                          <div className="flex justify-between text-emerald-400 font-semibold">
                            <span>Diskon Voucher ({discountPercent}%)</span>
                            <span>-{discountMora.toLocaleString()} Mora</span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-[#5D5187]/40 flex justify-between font-bold text-[#FFE7A5] text-sm">
                          <span>Total Pembayaran</span>
                          <span>{finalTotalMora.toLocaleString()} Mora</span>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <button
                        onClick={() => setShowCheckoutModal(true)}
                        className="w-full py-3 rounded-full bg-gradient-to-r from-[#ECE5D8] via-[#D3BC8E] to-[#ECE5D8] text-[#1D1A2A] font-bold text-xs tracking-wider shadow border border-[#FFE7A5] flex items-center justify-center gap-2 hover:opacity-95"
                      >
                        <span>{lang === 'ID' ? 'Lanjut ke Pengantaran Glider' : 'Proceed to Glider Delivery'}</span>
                        <ArrowRight size={15} />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* 4. ADVENTURER PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="p-4 space-y-4">
                  {/* Profile Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#272338] to-[#1D1A2A] border border-[#5D5187]/60 text-center relative overflow-hidden">
                    <div className="w-16 h-16 rounded-full border-2 border-[#FFE7A5] mx-auto overflow-hidden bg-slate-800 shadow">
                      <img src="https://enka.network/ui/UI_AvatarIcon_PlayerBoy.png" alt="Traveler" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-base font-bold text-slate-100 mt-2 font-genshin">Badar Rahman</h3>
                    <div className="text-xs text-[#FFE7A5] font-semibold">NIM 14524303 • TI-1 (Semester 5)</div>
                    <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#FFE7A5]/15 border border-[#FFE7A5]/30 text-[10px] text-[#FFE7A5] font-bold">
                      STIKOM Poltek Cirebon
                    </div>
                  </div>

                  {/* Wallet Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-[#272338] border border-[#5D5187]/50 flex items-center gap-2.5">
                      <img src="https://enka.network/ui/UI_ItemIcon_202.png" alt="Mora" className="w-7 h-7 object-contain" />
                      <div>
                        <div className="text-[10px] text-slate-400">Dompet Mora</div>
                        <div className="text-xs font-bold text-[#FFE7A5]">{moraBalance.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#272338] border border-[#5D5187]/50 flex items-center gap-2.5">
                      <img src="https://enka.network/ui/UI_ItemIcon_201.png" alt="Primogem" className="w-7 h-7 object-contain" />
                      <div>
                        <div className="text-[10px] text-slate-400">Tabungan Primo</div>
                        <div className="text-xs font-bold text-[#FFE7A5]">1,600</div>
                      </div>
                    </div>
                  </div>

                  {/* App Specs Info */}
                  <div className="p-3.5 rounded-xl bg-[#272338] border border-[#5D5187]/50 space-y-2 text-xs">
                    <div className="font-bold text-[#FFE7A5]">{lang === 'ID' ? 'Spesifikasi Tugas Pemvis 7' : 'Task Specification'}</div>
                    <div className="text-slate-300 text-[11px] space-y-1">
                      <div>• Mata Kuliah: Pemrograman Visual I (TI361)</div>
                      <div>• Framework: React Native + Expo Router v4</div>
                      <div>• Engine Desain: Genshin Impact Authentic UI/UX</div>
                      <div>• Anti-Slop: Zero Unicode Emojis (Pure Assets/SVG)</div>
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* Floating Quick Cart Bar (Shown in Catalog if items exist) */}
            {activeTab === 'catalog' && totalCartItems > 0 && (
              <div className="absolute bottom-[68px] left-3 right-3 p-2.5 rounded-xl bg-[#1D1A2A] border border-[#FFE7A5] shadow-xl flex items-center justify-between z-20 animate-bounce-subtle">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#FFE7A5] text-[#1D1A2A] font-bold flex items-center justify-center text-[10px]">
                    {totalCartItems}
                  </div>
                  <span className="text-slate-200 font-semibold">{subtotalMora.toLocaleString()} Mora</span>
                </div>
                <button
                  onClick={() => setActiveTab('cart')}
                  className="px-3 py-1 rounded-lg bg-[#FFE7A5] text-[#1D1A2A] text-xs font-bold hover:opacity-90 flex items-center gap-1"
                >
                  <span>{lang === 'ID' ? 'Buka Tas' : 'View Cart'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}

            {/* Bottom 4 Tabs Navigation */}
            <nav className="absolute bottom-0 left-0 right-0 h-16 bg-[#1D1A2A] border-t border-[#5D5187]/50 flex items-center justify-around px-2 z-30">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex flex-col items-center gap-1 transition ${activeTab === 'catalog' ? 'text-[#FFE7A5]' : 'text-slate-400'}`}
              >
                <UtensilsCrossed size={19} />
                <span className="text-[10px] font-bold">{lang === 'ID' ? 'Katalog' : 'Menu'}</span>
              </button>

              <button
                onClick={() => setActiveTab('explore')}
                className={`flex flex-col items-center gap-1 transition ${activeTab === 'explore' ? 'text-[#FFE7A5]' : 'text-slate-400'}`}
              >
                <Compass size={19} />
                <span className="text-[10px] font-bold">{lang === 'ID' ? 'Khasiat' : 'Buffs'}</span>
              </button>

              <button
                onClick={() => setActiveTab('cart')}
                className={`flex flex-col items-center gap-1 transition relative ${activeTab === 'cart' ? 'text-[#FFE7A5]' : 'text-slate-400'}`}
              >
                <ShoppingBag size={19} />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
                <span className="text-[10px] font-bold">{lang === 'ID' ? 'Tas' : 'Cart'}</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-1 transition ${activeTab === 'profile' ? 'text-[#FFE7A5]' : 'text-slate-400'}`}
              >
                <User size={19} />
                <span className="text-[10px] font-bold">{lang === 'ID' ? 'Profil' : 'Profile'}</span>
              </button>
            </nav>

            {/* MODAL: Dish Dossier Detail */}
            {selectedDishModal && (
              <div className="absolute inset-0 bg-black/75 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
                <div className="w-full max-h-[85%] bg-[#E9E5DC] text-[#1D1A2A] rounded-t-3xl sm:rounded-2xl border-t-2 sm:border border-[#FFE7A5] overflow-y-auto p-4 flex flex-col justify-between shadow-2xl">
                  {/* Modal Header */}
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded bg-[#1D1A2A] text-[#FFE7A5] text-[10px] font-bold">
                      {'★'.repeat(selectedDishModal.rarity)} • {selectedDishModal.region}
                    </span>
                    <button onClick={() => setSelectedDishModal(null)} className="p-1 rounded-full text-[#1D1A2A]">
                      <X size={18} />
                    </button>
                  </div>

                  {/* Hero Image & Name */}
                  <div className="text-center my-2">
                    <img src={selectedDishModal.image} alt={selectedDishModal.name} className="w-28 h-28 object-contain mx-auto drop-shadow-lg" />
                    <h3 className="text-base font-extrabold font-genshin text-[#1D1A2A] mt-1">{selectedDishModal.name}</h3>
                    <div className="text-xs font-bold text-[#9C5818] mt-0.5">{selectedDishModal.priceMora.toLocaleString()} Mora</div>
                  </div>

                  {/* Effect & Lore */}
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#F5F2EB] border border-[#D3BC8E]">
                      <div className="font-bold text-[#5D5187] text-[11px]">{lang === 'ID' ? 'Efek Khasiat Masakan:' : 'Combat Effect:'}</div>
                      <p className="text-[#4A5366] text-[11px] mt-0.5 leading-snug">{selectedDishModal.effect}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F5F2EB] border border-[#D3BC8E]">
                      <div className="font-bold text-[#5D5187] text-[11px]">{lang === 'ID' ? 'Bahan Baku Resep:' : 'Recipe Ingredients:'}</div>
                      <div className="grid grid-cols-2 gap-1.5 mt-1">
                        {selectedDishModal.ingredients.map(ing => (
                          <div key={ing.name} className="flex items-center gap-1.5 text-[10px] text-[#4A5366]">
                            <img src={ing.icon} alt={ing.name} className="w-5 h-5 object-contain" />
                            <span>{ing.name} x{ing.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-[10px] text-[#4A5366] italic leading-relaxed px-1">
                      "{selectedDishModal.description}"
                    </p>
                  </div>

                  {/* Action Stepper & Add Button */}
                  <div className="mt-4 pt-3 border-t border-[#D3BC8E] flex items-center justify-between gap-3">
                    <div className="flex items-center bg-[#F5F2EB] rounded-lg border border-[#D3BC8E] px-2 py-1">
                      <button onClick={() => setModalQuantity(q => Math.max(1, q - 1))} className="p-1"><Minus size={13} /></button>
                      <span className="w-6 text-center font-bold text-xs">{modalQuantity}</span>
                      <button onClick={() => setModalQuantity(q => q + 1)} className="p-1"><Plus size={13} /></button>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(selectedDishModal, modalQuantity);
                        setSelectedDishModal(null);
                      }}
                      className="flex-1 py-2.5 rounded-full bg-[#1D1A2A] text-[#FFE7A5] font-bold text-xs tracking-wider shadow border border-[#FFE7A5]"
                    >
                      {lang === 'ID' ? 'Tambah ke Pesanan' : 'Add to Feast'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL: Checkout Delivery */}
            {showCheckoutModal && (
              <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="w-full bg-[#1D1A2A] rounded-2xl border-2 border-[#FFE7A5] p-4 text-slate-100 space-y-3">
                  <div className="flex justify-between items-center border-b border-[#5D5187]/60 pb-2">
                    <h3 className="text-sm font-bold text-[#FFE7A5] font-genshin">
                      {lang === 'ID' ? 'Konfirmasi Pengantaran Glider' : 'Confirm Glider Delivery'}
                    </h3>
                    <button onClick={() => setShowCheckoutModal(false)}><X size={16} /></button>
                  </div>

                  {/* Delivery Location Selector */}
                  <div className="text-xs space-y-1">
                    <label className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                      <MapPin size={13} className="text-[#FFE7A5]" />
                      <span>{lang === 'ID' ? 'Titik Antar di Teyvat:' : 'Delivery Location:'}</span>
                    </label>
                    <select
                      value={deliveryLocation}
                      onChange={e => setDeliveryLocation(e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#272338] text-xs text-slate-100 border border-[#5D5187] focus:outline-none"
                    >
                      <option value="Knights of Favonius HQ">Knights of Favonius HQ (Mondstadt)</option>
                      <option value="Wanmin Restaurant Terrace">Wanmin Restaurant Terrace (Liyue)</option>
                      <option value="Grand Narukami Shrine">Grand Narukami Shrine (Inazuma)</option>
                      <option value="Maison Cardinalice">Maison Cardinalice (Fontaine)</option>
                      <option value="Stadium of the Sacred Flame">Stadium of Sacred Flame (Natlan)</option>
                      <option value="Kampus STIKOM Poltek Cirebon">Kampus STIKOM Poltek Cirebon</option>
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div className="text-xs space-y-1">
                    <label className="text-[11px] text-slate-300 font-semibold">
                      {lang === 'ID' ? 'Metode Pembayaran:' : 'Payment Method:'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPaymentMethod('MORA')}
                        className={`p-2 rounded-lg border text-center text-[11px] font-bold ${
                          paymentMethod === 'MORA' ? 'bg-[#FFE7A5] text-[#1D1A2A] border-[#FFE7A5]' : 'bg-[#272338] text-slate-300 border-[#5D5187]'
                        }`}
                      >
                        Tunai Koin Mora
                      </button>
                      <button
                        onClick={() => setPaymentMethod('NORTHLAND')}
                        className={`p-2 rounded-lg border text-center text-[11px] font-bold ${
                          paymentMethod === 'NORTHLAND' ? 'bg-[#FFE7A5] text-[#1D1A2A] border-[#FFE7A5]' : 'bg-[#272338] text-slate-300 border-[#5D5187]'
                        }`}
                      >
                        Kartu Northland Bank
                      </button>
                    </div>
                  </div>

                  {/* Order Total Notice */}
                  <div className="p-2.5 rounded-lg bg-[#120F1D] text-xs flex justify-between items-center text-[#FFE7A5] font-bold">
                    <span>Total Mora:</span>
                    <span>{finalTotalMora.toLocaleString()} Mora</span>
                  </div>

                  <button
                    onClick={confirmOrder}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#ECE5D8] via-[#D3BC8E] to-[#ECE5D8] text-[#1D1A2A] font-bold text-xs tracking-wider shadow"
                  >
                    {lang === 'ID' ? 'Konfirmasi & Kirim Pesanan' : 'Confirm Feast Order'}
                  </button>
                </div>
              </div>
            )}

            {/* MODAL: Quest Complete Dialog */}
            {showQuestComplete && (
              <div className="absolute inset-0 bg-black/85 z-50 flex items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-full bg-[#1D1A2A] border-2 border-[#FFE7A5] rounded-3xl p-6 shadow-2xl space-y-3 relative overflow-hidden">
                  <div className="w-14 h-14 rounded-full bg-[#FFE7A5]/20 border border-[#FFE7A5] flex items-center justify-center mx-auto text-[#FFE7A5]">
                    <CheckCircle2 size={30} />
                  </div>

                  <h2 className="text-lg font-extrabold text-[#FFE7A5] font-genshin tracking-wide">
                    QUEST COMPLETE!
                  </h2>
                  <div className="text-xs font-bold text-slate-100">
                    {lang === 'ID' ? 'Pesanan Santapan Berhasil Dikirim' : 'Feast Order Successfully Delivered!'}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed px-2">
                    {lang === 'ID'
                      ? `Kurir Glider Favonius sedang meluncur menuju ${deliveryLocation}. Estimasi tiba: 15 Menit.`
                      : `Favonius Glider Courier is flying to ${deliveryLocation}. Estimated arrival: 15 Mins.`}
                  </p>

                  <button
                    onClick={() => {
                      setShowQuestComplete(false);
                      setActiveTab('catalog');
                    }}
                    className="mt-3 w-full py-2.5 rounded-full bg-[#FFE7A5] text-[#1D1A2A] text-xs font-bold shadow hover:opacity-90"
                  >
                    {lang === 'ID' ? 'Kembali ke Beranda' : 'Return to Catalog'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
