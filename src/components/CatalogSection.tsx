import React, { useMemo, useState } from 'react';
import { Check, Plus, Search, SlidersHorizontal } from 'lucide-react';
import {
  CATEGORIES,
  PRODUCTS,
  ProductCategory,
  ProductItem,
  normalizeArabic,
} from '../data/blendyData';
import { ProductVisual } from './ProductVisual';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'calories-asc';

interface CatalogSectionProps {
  onAddToCart: (product: ProductItem, sizeLabel?: string, priceOverride?: number) => void;
  onSelectProduct: (product: ProductItem) => void;
  activeFlavourFilter: string | null;
  onClearFlavourFilter: () => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  onAddToCart,
  onSelectProduct,
  activeFlavourFilter,
  onClearFlavourFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const q = normalizeArabic(searchQuery);

    let list = PRODUCTS.filter((p) => {
      if (selectedCategory !== 'الكل' && p.category !== selectedCategory) {
        return false;
      }
      if (activeFlavourFilter && p.flavourTag !== activeFlavourFilter) {
        return false;
      }
      if (q) {
        const haystack = normalizeArabic(
          `${p.name} ${p.subtitle} ${p.category} ${p.ingredients.join(' ')}`
        );
        return haystack.includes(q);
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'calories-asc') {
      list = [...list].sort((a, b) => a.calories - b.calories);
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy, activeFlavourFilter]);

  const handleQuickAdd = (e: React.MouseEvent, product: ProductItem) => {
    e.stopPropagation();
    onAddToCart(product);
    setRecentlyAddedId(product.id);
    window.setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1200);
  };

  const flavourNamesMap: Record<string, string> = {
    berry: 'التوت',
    kiwi: 'الكيوي',
    banana: 'الموز',
    strawberry: 'الفراولة',
  };

  return (
    <section
      id="catalog"
      dir="rtl"
      className="bg-[#FAF8F5] text-[#1F1B24] py-16 md:py-24 px-5 md:px-10"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Editorial Ruqaa Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/[0.08]">
          <div>
            <p className="text-sm font-semibold text-[#6F5C8E] mb-2">
              عصر بارد يومياً · ٢٤ منتجاً طازجاً
            </p>
            <h2 className="font-ruqaa text-4xl sm:text-5xl md:text-6xl font-bold text-[#1F1B24] leading-tight">
              تشكيلة بليندي الكاملة
            </h2>
          </div>

          <p className="text-[15px] leading-relaxed text-[#575061] max-w-md">
            فاكهة حقيقية معصورة على البارد يومياً دون أي سكر مضاف أو مواد حافظة، تصلك مبردة خلال دقائق.
          </p>
        </div>

        {/* Filter, Search & Sort Controls */}
        <div className="py-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Segmented Buttons */}
          <div
            className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EFECE6] rounded-xl w-fit"
            role="tablist"
            aria-label="تصنيفات المنتجات"
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              const count =
                cat === 'الكل'
                  ? PRODUCTS.length
                  : PRODUCTS.filter((p) => p.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (activeFlavourFilter) onClearFlavourFilter();
                  }}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-[#1F1B24] shadow-sm'
                      : 'text-[#5C5566] hover:text-[#1F1B24]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {activeFlavourFilter && (
              <button
                type="button"
                onClick={onClearFlavourFilter}
                className="px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-[#EDE7F6] text-[#4E3B6E] hover:bg-[#E1D7F2] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                نكهة {flavourNamesMap[activeFlavourFilter] || activeFlavourFilter} × عرض الكل
              </button>
            )}

            <div className="relative flex-1 sm:w-64">
              <Search
                className="w-4 h-4 text-[#787084] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن نكهة أو مكون..."
                aria-label="ابحث في منتجات بليندي"
                className="w-full bg-white border border-black/10 rounded-xl pr-10 pl-4 py-2.5 text-sm text-[#1F1B24] placeholder:text-[#8B8396] focus:outline-none focus:border-[#7B61A8]"
              />
            </div>

            <div className="relative flex items-center">
              <SlidersHorizontal
                className="w-4 h-4 text-[#787084] absolute right-3.5 pointer-events-none"
                aria-hidden="true"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="ترتيب المنتجات"
                className="w-full sm:w-auto bg-white border border-black/10 rounded-xl pr-10 pl-4 py-2.5 text-sm font-medium text-[#1F1B24] focus:outline-none focus:border-[#7B61A8] cursor-pointer"
              >
                <option value="featured">الأكثر مبيعاً</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="calories-asc">الأقل سعرات حرارية</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-black/[0.06]">
            <p className="font-ruqaa text-3xl text-[#1F1B24] mb-2">
              لم نجد منتجات مطابقة لبحثك
            </p>
            <p className="text-sm text-[#6B6375] mb-5">
              جرّب البحث بكلمة أخرى أو تصفح كل الخلطات الطازجة.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('الكل');
                setSearchQuery('');
                onClearFlavourFilter();
              }}
              className="px-6 py-2.5 bg-[#1F1B24] text-white text-sm font-semibold rounded-xl hover:bg-[#352E3E] transition-colors cursor-pointer"
            >
              إظهار جميع المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = recentlyAddedId === product.id;

              return (
                <article
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="product-card-perf group bg-white rounded-2xl border border-black/[0.06] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(35,25,55,0.08)] cursor-pointer"
                >
                  {/* Visual Stage (68% of card focus) */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <ProductVisual product={product} size="card" />
                  </div>

                  {/* Clean Metadata & Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center flex-wrap gap-1.5 text-xs text-[#736B7E] mb-1.5 tabular-nums">
                        <span>{product.volume}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.calories} سعرة</span>
                        {product.note && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-[#5C4585]">
                              {product.note}
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="font-ruqaa text-2xl font-bold text-[#1F1B24] leading-snug mb-1">
                        {product.name}
                      </h3>

                      <p className="text-[13px] text-[#6B6376] line-clamp-1">
                        {product.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-black/[0.06]">
                      <div className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-lg font-extrabold text-[#1F1B24]">
                          {product.price} ر.س
                        </span>
                        {product.oldPrice && (
                          <span className="text-xs text-[#948C9E] line-through">
                            {product.oldPrice} ر.س
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                          isAdded
                            ? 'bg-[#2E7D4F] text-white'
                            : 'bg-[#1F1B24] text-white hover:bg-[#3A3245]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>أُضيف للسلة</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>أضف للسلة</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
