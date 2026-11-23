import React from 'react';
import { ASSET_ICONS } from './data/dishes';
import { useDelicaciesStore } from './store/useDelicaciesStore';
import {
  BottomNavBar,
  FloatingQuickCartBar,
  TeyvatToast,
} from './components/TeyvatUI';
import { CelestiaGateScreen } from './screens/CelestiaGateScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { CartScreen } from './screens/CartScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { DishDetailScreen } from './screens/DishDetailScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrderStatusScreen } from './screens/OrderStatusScreen';

export default function App() {
  const hasEntered = useDelicaciesStore((s) => s.hasEntered);
  const activeTab = useDelicaciesStore((s) => s.activeTab);
  const stack = useDelicaciesStore((s) => s.stack);
  const setActiveTab = useDelicaciesStore((s) => s.setActiveTab);
  const getCartTotals = useDelicaciesStore((s) => s.getCartTotals);
  const toastMessage = useDelicaciesStore((s) => s.toastMessage);
  // Subscribe to cart & coupon so FloatingQuickCartBar & tab badge stay reactive
  useDelicaciesStore((s) => s.cart);
  useDelicaciesStore((s) => s.appliedCouponCode);

  const totals = getCartTotals();
  const currentStack = stack.length > 0 ? stack[stack.length - 1] : null;
  const showFloatingCart =
    hasEntered &&
    !currentStack &&
    (activeTab === 'catalog' || activeTab === 'explore') &&
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
      case 'explore':
        return <ExploreScreen />;
      case 'cart':
        return <CartScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'catalog':
      default:
        return <CatalogScreen />;
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#120F1D]/70 via-[#171421]/65 to-[#120F1D]/90" />
      </div>

      {/* Responsive Mobile Shell: Full-Screen on Mobile, Centered 420x840 Frame on Desktop */}
      <main className="relative z-10 w-full h-[100dvh] md:w-[420px] md:h-[840px] md:max-h-[94dvh] bg-[#1D1A2A] md:rounded-[36px] md:border md:border-[#5D5187]/65 md:shadow-[0_24px_80px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col">
        {/* Toast Feedback Host */}
        <TeyvatToast message={toastMessage} />

        {/* Active Viewport Content */}
        <div className="flex-1 min-h-0 relative flex flex-col">
          {renderActiveContent()}

          {/* Floating Quick Cart Bar above Bottom Nav on Catalog & Explore */}
          {showFloatingCart && (
            <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
              <FloatingQuickCartBar
                itemCount={totals.itemCount}
                totalMora={totals.finalTotal}
                onOpenCart={() => setActiveTab('cart')}
              />
            </div>
          )}
        </div>

        {/* 4-Tab Bottom Navigation (visible on primary tabs after entering Celestia Gate) */}
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
