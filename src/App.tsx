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
    <div className="min-h-[100dvh] w-full bg-[#120F1D] text-[#E9E5DC] flex items-center justify-center md:p-5 relative overflow-hidden">
      {/* Desktop Ambient Starry Backdrop (hidden on full-screen mobile) */}
      <div className="hidden md:block fixed inset-0 pointer-events-none" aria-hidden="true">
        <img
          src={ASSET_ICONS.constellationBg}
          alt=""
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#120F1D]/72 via-[#171421]/68 to-[#120F1D]/92" />
      </div>

      {/* Responsive Mobile Shell: Full-Screen on Mobile, Centered 420x840 Frame on Desktop */}
      <main className="relative z-10 w-full h-[100dvh] md:w-[420px] md:h-[840px] md:max-h-[94dvh] bg-[#171421] md:rounded-[36px] md:border md:border-[#5D5187]/75 md:shadow-2xl overflow-hidden flex flex-col">
        {/* Toast Feedback Host */}
        <TeyvatToast message={toastMessage} />

        {/* Active Viewport Content */}
        <div className="flex-1 min-h-0 relative flex flex-col">
          {renderActiveContent()}

          {/* Floating Quick Cart Bar above Bottom Nav on Beranda & Katalog */}
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

        {/* 4-Tab Bottom Navigation (Beranda, Katalog, Keranjang, Profil) */}
        {hasEntered && !currentStack && (
          <BottomNavBar
            activeTab={activeTab}
            cartCount={totals.itemCount}
            onSelectTab={setActiveTab}
          />
        )}
      </main>
    </div>
  );
}
