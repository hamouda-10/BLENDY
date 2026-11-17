/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp, ShoppingBag } from 'lucide-react';
import { HeroSlider } from './components/HeroSlider';
import { CatalogSection } from './components/CatalogSection';
import {
  CartDrawer,
  CartEntry,
  ProductModal,
  RegisterModal,
} from './components/DrawersAndModals';
import { FlavourKey, ProductItem } from './data/blendyData';

export default function App() {
  const [activeFlavourIdx, setActiveFlavourIdx] = useState(0);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [activeFlavourFilter, setActiveFlavourFilter] = useState<string | null>(null);
  const [showStickyNav, setShowStickyNav] = useState(false);

  const heroRef = useRef<HTMLElement | null>(null);

  // Show compact sticky bar only after scrolling past the Hero
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyNav(!entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleAddToCart = useCallback(
    (
      product: ProductItem,
      sizeLabel?: string,
      priceOverride?: number,
      qty = 1
    ) => {
      const label = sizeLabel || product.volume;
      const unitPrice = priceOverride ?? product.price;
      const key = `${product.id}__${label}`;

      setCart((prev) => {
        const existing = prev.find((e) => e.key === key);
        if (existing) {
          return prev.map((e) =>
            e.key === key ? { ...e, qty: e.qty + qty } : e
          );
        }
        return [
          ...prev,
          { key, product, sizeLabel: label, unitPrice, qty },
        ];
      });
    },
    []
  );

  const handleUpdateQty = useCallback((key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((e) => (e.key === key ? { ...e, qty: e.qty + delta } : e))
        .filter((e) => e.qty > 0)
    );
  }, []);

  const handleRemoveCartItem = useCallback((key: string) => {
    setCart((prev) => prev.filter((e) => e.key !== key));
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  const handleShopNow = useCallback((_flavourKey: FlavourKey) => {
    setActiveFlavourFilter(null);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Compact Sticky Nav (appears cleanly when scrolled past Hero) */}
      <div
        dir="rtl"
        className={`fixed top-0 inset-x-0 z-40 transition-transform duration-200 ease-out bg-white/92 backdrop-blur-md border-b border-black/[0.08] ${
          showStickyNav ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-4">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-ruqaa text-3xl font-bold text-[#1F1B24] whitespace-nowrap shrink-0"
          >
            بليندي
          </a>

          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5266] hover:text-[#1F1B24] cursor-pointer whitespace-nowrap"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>معرض النكهات</span>
            </button>

            <button
              type="button"
              onClick={() => setRegisterOpen(true)}
              className="text-xs sm:text-sm font-semibold text-[#4E4659] hover:text-[#1F1B24] cursor-pointer whitespace-nowrap"
            >
              {userName ? `أهلاً، ${userName}` : 'التسجيل'}
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F1B24] text-white text-xs sm:text-sm font-bold hover:bg-[#352E3E] transition-colors cursor-pointer whitespace-nowrap tabular-nums"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>السلة ({totalCartCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main id="top">
        <HeroSlider
          heroRef={heroRef}
          activeIndex={activeFlavourIdx}
          onActiveChange={setActiveFlavourIdx}
          cartCount={totalCartCount}
          userName={userName}
          onOpenCart={() => setCartOpen(true)}
          onOpenRegister={() => setRegisterOpen(true)}
          onShopNow={handleShopNow}
        />

        <CatalogSection
          onAddToCart={(p) => handleAddToCart(p)}
          onSelectProduct={setSelectedProduct}
          activeFlavourFilter={activeFlavourFilter}
          onClearFlavourFilter={() => setActiveFlavourFilter(null)}
        />

        {/* Freshness & Craftsmanship Strip */}
        <section
          dir="rtl"
          className="bg-white border-t border-black/[0.06] py-14 px-5 md:px-10"
        >
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#6F5C8E]">٠١ · نقاء تام</p>
              <h3 className="font-ruqaa text-3xl font-bold text-[#1F1B24]">
                فاكهة كاملة دون سكر مضاف
              </h3>
              <p className="text-sm leading-relaxed text-[#5F576B]">
                نختار أفضل المحاصيل الموسمية ونعصرها يومياً على البارد للحفاظ على الفيتامينات والنكهة الأصيلة.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-[#6F5C8E]">٠٢ · تنوّع يومي</p>
              <h3 className="font-ruqaa text-3xl font-bold text-[#1F1B24]">
                أكثر من ٢٤ خلطة متوازنة
              </h3>
              <p className="text-sm leading-relaxed text-[#5F576B]">
                من التوت البري والكيوي الأخضر إلى خلطات البروتين والديتوكس وباقات التوفير العائلية.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-[#6F5C8E]">٠٣ · توصيل مبرد</p>
              <h3 className="font-ruqaa text-3xl font-bold text-[#1F1B24]">
                طازج حتى باب منزلك
              </h3>
              <p className="text-sm leading-relaxed text-[#5F576B]">
                زجاجات معقمة ومحفوظة في سلسلة تبريد مستمرة لتصلك باردة وجاهزة للاستمتاع في كل وقت.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Arabic Footer */}
      <footer
        dir="rtl"
        className="bg-[#FAF8F5] border-t border-black/[0.08] py-10 px-5 md:px-10"
      >
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#645C70]">
          <div className="flex items-center gap-4">
            <span className="font-ruqaa text-3xl font-bold text-[#1F1B24]">
              بليندي
            </span>
            <span>سموذي الفواكه الطبيعية الطازجة</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#1F1B24] cursor-pointer"
            >
              النكهات الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="hover:text-[#1F1B24] cursor-pointer"
            >
              سلة المشتريات
            </button>
            <button
              type="button"
              onClick={() => setRegisterOpen(true)}
              className="hover:text-[#1F1B24] cursor-pointer"
            >
              حسابي
            </button>
            <span className="text-[#8E8699]">© ٢٠٢٦ بليندي</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      <RegisterModal
        open={registerOpen}
        currentUser={userName}
        onClose={() => setRegisterOpen(false)}
        onAuthSuccess={setUserName}
        onLogout={() => setUserName(null)}
      />
    </div>
  );
}
