import React, { useEffect } from 'react';
import { ASSET_ICONS } from './data/dishes';
import { useDelicaciesStore } from './store/useDelicaciesStore';
import {
  BottomNavBar,
  FloatingQuickCartBar,
  TeyvatToast,
} from './components/TeyvatUI';
import { CelestiaGateScreen } from './screens/CelestiaGateScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { CartScreen } from './screens/CartScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { DishDetailScreen } from './screens/DishDetailScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrderStatusScreen } from './screens/OrderStatusScreen';

export default function App() {
  const hasEntered = useDelicaciesStore((s) => s.hasEntered);
  const activeTab = useDelicaciesStore((s) => s.activeTab);
  const stack = useDelicaciesStore((s) => s.stack);
  const enterTeyvat = useDelicaciesStore((s) => s.enterTeyvat);
  const setActiveTab = useDelicaciesStore((s) => s.setActiveTab);
  const getCartTotals = useDelicaciesStore((s) => s.getCartTotals);
  const toastMessage = useDelicaciesStore((s) => s.toastMessage);
  // Subscribe to cart & coupon so FloatingQuickCartBar & tab badge stay reactive
  useDelicaciesStore((s) => s.cart);
  useDelicaciesStore((s) => s.appliedCouponCode);

  // Support ?autostart=1 query parameter to enter straight to Beranda
  useEffect(() => {
    if (typeof window === 'undefined' || hasEntered) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      enterTeyvat(false);
    }
  }, [hasEntered, enterTeyvat]);

  const totals = getCartTotals();
  const currentStack = stack.length > 0 ? stack[stack.length - 1] : null;
  const showFloatingCart =
    hasEntered &&
    !currentStack &&
    (activeTab === 'beranda' || activeTab === 'katalog') &&
    totals.itemCount > 0;

  const renderActiveContent = () => {
    if (!hasEntered) {
      return <CelestiaGateScreen />;
    }

    if (currentStack) {
      if (currentStack.name === 'dish') {
        return <DishDetailScreen dishId={currentStack.dishId} />;
      }
      if (currentStack.name === 'checkout') {
        return <CheckoutScreen />;
      }
      return <OrderStatusScreen orderId={currentStack.orderId} />;
    }

    switch (activeTab) {
      case 'katalog':
        return <CatalogScreen />;
      case 'keranjang':
        return <CartScreen />;
      case 'profil':
        return <ProfileScreen />;
      case 'beranda':
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#151A26] text-[#F7F4EE] flex items-center justify-center md:p-5 relative overflow-hidden">
      {/* Desktop Ambient Cosmic Indigo Backdrop (hidden on edge-to-edge mobile) */}
      <div className="hidden md:block fixed inset-0 pointer-events-none" aria-hidden="true">
        <img
          src={ASSET_ICONS.constellationBg}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#151A26]/75 via-[#1A1F2C]/70 to-[#151A26]/92" />
      </div>

      {/* True Edge-to-Edge Fullscreen Mobile Canvas; Centered 420x840 Frame on Desktop */}
      <main
        className="relative z-10 w-full h-[100dvh] md:w-[420px] md:h-[840px] md:max-h-[94dvh] md:rounded-[34px] md:border md:border-[#FFE7A5]/25 md:shadow-2xl overflow-hidden flex flex-col"
        style={{
          background:
            'linear-gradient(180deg, #1A1F2C 0%, #1E2333 52%, #191E2B 100%)',
        }}
      >
        {/* Continuous Ambient Cosmic Stardust Layer flowing full-bleed edge-to-edge */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <img
            src={ASSET_ICONS.constellationBg}
            alt=""
            className="w-full h-full object-cover opacity-[0.16] mix-blend-screen"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 82% 8%, rgba(255, 231, 165, 0.08) 0%, transparent 42%), radial-gradient(circle at 12% 85%, rgba(86, 226, 182, 0.06) 0%, transparent 45%)',
            }}
          />
        </div>

        {/* Toast Feedback Host */}
        <TeyvatToast message={toastMessage} />

        {/* Full-Bleed Active Viewport Content */}
        <div className="relative z-10 flex-1 min-h-0 flex flex-col">
          {renderActiveContent()}

          {/* Floating Quick Cart Bar above Glassmorphic Bottom Nav */}
          {showFloatingCart && (
            <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
              <FloatingQuickCartBar
                itemCount={totals.itemCount}
                totalMora={totals.finalTotal}
                onOpenCart={() => setActiveTab('keranjang')}
              />
            </div>
          )}
        </div>

        {/* Glassmorphic 4-Tab Bottom Navigation (Beranda, Katalog, Keranjang, Profil) */}
        {hasEntered && !currentStack && (
          <div className="relative z-20 shrink-0">
            <BottomNavBar
              activeTab={activeTab}
              cartCount={totals.itemCount}
              onSelectTab={setActiveTab}
            />
          </div>
        )}
      </main>
    </div>
  );
}
