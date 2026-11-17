import React, { useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { ProductItem } from '../data/blendyData';
import { ProductVisual } from './ProductVisual';

export interface CartEntry {
  key: string;
  product: ProductItem;
  sizeLabel: string;
  unitPrice: number;
  qty: number;
}

/* ---------------- Product Detail Modal ---------------- */
interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (
    product: ProductItem,
    sizeLabel: string,
    unitPrice: number,
    qty: number
  ) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const isPack = product.category === 'باقات التوفير';
  const sizeOptions = isPack
    ? [{ label: product.volume, extra: 0 }]
    : [
        { label: product.volume, extra: 0 },
        { label: '٥٠٠ مل', extra: 6 },
        { label: '١ لتر عائلي', extra: 16 },
      ];

  const activeSize = sizeOptions[sizeIdx] || sizeOptions[0];
  const unitPrice = product.price + activeSize.extra;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق النافذة"
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-white/90 text-[#1F1B24] flex items-center justify-center shadow-sm hover:bg-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="h-72 md:h-full min-h-[320px]">
          <ProductVisual product={product} size="modal" />
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-[#6F5C8E] mb-1.5">
              {product.category} · {activeSize.label}
            </p>
            <h3 className="font-ruqaa text-3xl md:text-4xl font-bold text-[#1F1B24] mb-2 leading-snug">
              {product.name}
            </h3>
            <p className="text-sm leading-relaxed text-[#585163] mb-5">
              {product.description}
            </p>

            {/* Nutritional strip (tabular numbers) */}
            <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-2xl bg-[#FAF8F5] border border-black/[0.06] text-center mb-5 tabular-nums">
              <div>
                <div className="text-xs text-[#787084]">السعرات</div>
                <div className="text-base font-bold text-[#1F1B24]">
                  {product.calories}
                </div>
              </div>
              <div className="border-x border-black/[0.08]">
                <div className="text-xs text-[#787084]">البروتين</div>
                <div className="text-base font-bold text-[#1F1B24]">
                  {product.proteinGrams} غ
                </div>
              </div>
              <div>
                <div className="text-xs text-[#787084]">فيتامين C</div>
                <div className="text-base font-bold text-[#1F1B24]">
                  {product.vitaminC}
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-5">
              <div className="text-xs font-bold text-[#1F1B24] mb-1.5">
                المكونات الطبيعية:
              </div>
              <p className="text-xs leading-relaxed text-[#645C70]">
                {product.ingredients.join(' · ')}
              </p>
            </div>

            {/* Size selector */}
            {sizeOptions.length > 1 && (
              <div>
                <div className="text-xs font-bold text-[#1F1B24] mb-2">
                  اختر الحجم:
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((opt, idx) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSizeIdx(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        sizeIdx === idx
                          ? 'bg-[#1F1B24] text-white border-[#1F1B24]'
                          : 'bg-white text-[#4A4354] border-black/10 hover:border-black/25'
                      }`}
                    >
                      {opt.label}
                      {opt.extra > 0 ? ` (+${opt.extra} ر.س)` : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-black/[0.08]">
            <div className="flex items-center border border-black/10 rounded-xl bg-[#FAF8F5]">
              <button
                type="button"
                aria-label="تقليل الكمية"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-[#1F1B24] hover:bg-black/5 rounded-r-xl cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                aria-label="زيادة الكمية"
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-[#1F1B24] hover:bg-black/5 rounded-l-xl cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onAddToCart(product, activeSize.label, unitPrice, qty);
                onClose();
              }}
              className="flex-1 py-3 px-5 bg-[#1F1B24] hover:bg-[#342D3E] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer tabular-nums"
            >
              إضافة للسلة — {unitPrice * qty} ر.س
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Cart Slide-Over Drawer ---------------- */
interface CartDrawerProps {
  open: boolean;
  items: CartEntry[];
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemove: (key: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  items,
  onClose,
  onUpdateQty,
  onRemove,
  onClearCart,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'done'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [orderId, setOrderId] = useState('BL-4821');

  if (!open) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const freeShippingThreshold = 150;
  const deliveryFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setOrderId(`BL-${randomNum}`);
    setCheckoutStep('done');
    onClearCart();
  };

  const resetAndClose = () => {
    setCheckoutStep('cart');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs"
      dir="rtl"
      onClick={resetAndClose}
    >
      <aside
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        aria-label="سلة المشتريات"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-black/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#1F1B24]" />
            <h2 className="font-ruqaa text-3xl font-bold text-[#1F1B24]">
              سلة المشتريات
            </h2>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="إغلاق السلة"
            className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center text-[#1F1B24] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {checkoutStep === 'done' ? (
            <div className="py-14 text-center">
              <CheckCircle2 className="w-14 h-14 text-[#2E7D4F] mx-auto mb-4" />
              <h3 className="font-ruqaa text-4xl font-bold text-[#1F1B24] mb-2">
                تم تأكيد طلبك بنجاح
              </h3>
              <p className="text-sm text-[#5A5266] mb-4 tabular-nums">
                رقم الطلب #{orderId} — جاري تجهيز عصائرك الطازجة مبردة
              </p>
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-black/[0.06] text-xs text-[#645C70] leading-relaxed mb-6">
                سيصلك المندوب خلال ٣٥–٤٥ دقيقة إلى: {address || 'عنوانك المسجل'}
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-3 bg-[#1F1B24] text-white text-sm font-bold rounded-xl hover:bg-[#342D3E] cursor-pointer"
              >
                متابعة التصفح
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="w-12 h-12 text-[#B8B0C4] mx-auto mb-3" />
              <p className="font-ruqaa text-3xl text-[#1F1B24] mb-2">
                سلتك فارغة حالياً
              </p>
              <p className="text-sm text-[#6E667A] mb-6">
                أضف نكهاتك المفضلة من التوت والكيوي والموز والفراولة.
              </p>
              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-2.5 bg-[#1F1B24] text-white text-sm font-semibold rounded-xl cursor-pointer"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : checkoutStep === 'form' ? (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-black/[0.06] text-xs text-[#4C4556] flex items-center justify-between tabular-nums">
                <span>الإجمالي المستحق:</span>
                <strong className="text-base text-[#1F1B24]">{total} ر.س</strong>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1B24] mb-1.5">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: سارة العتيبي"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:border-[#7B61A8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1B24] mb-1.5">
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-left tabular-nums focus:outline-none focus:border-[#7B61A8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1B24] mb-1.5">
                  المدينة والعنوان التفصيلي
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="الرياض، حي الياسمين، شارع..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:border-[#7B61A8]"
                />
              </div>

              <div>
                <div className="text-xs font-bold text-[#1F1B24] mb-2">
                  طريقة الدفع
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-[#1F1B24] text-white border-[#1F1B24]'
                        : 'bg-white text-[#4A4354] border-black/10'
                    }`}
                  >
                    الدفع عند الاستلام
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#1F1B24] text-white border-[#1F1B24]'
                        : 'bg-white text-[#4A4354] border-black/10'
                    }`}
                  >
                    بطاقة مدى / ائتمان
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Free Shipping Progress */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-black/[0.06] tabular-nums">
                <p className="text-xs font-semibold text-[#4E4659] mb-2">
                  {remainingForFree === 0
                    ? 'مبارك! حصلت على توصيل مبرد مجاني'
                    : `أضف منتجات بقيمة ${remainingForFree} ر.س للحصول على توصيل مجاني`}
                </p>
                <div className="h-1.5 w-full bg-black/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7B61A8] transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-black/[0.06]">
                {items.map((entry) => (
                  <div key={entry.key} className="py-4 flex gap-3.5 items-center">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-black/[0.05]">
                      <ProductVisual product={entry.product} size="card" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-ruqaa text-xl font-bold text-[#1F1B24] truncate">
                        {entry.product.name}
                      </h4>
                      <p className="text-xs text-[#736B7E] mb-2 tabular-nums">
                        {entry.sizeLabel} · {entry.unitPrice} ر.س
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-black/10 rounded-lg bg-[#FAF8F5]">
                          <button
                            type="button"
                            aria-label="تقليل"
                            onClick={() => onUpdateQty(entry.key, -1)}
                            className="w-7 h-7 flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold tabular-nums">
                            {entry.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="زيادة"
                            onClick={() => onUpdateQty(entry.key, 1)}
                            className="w-7 h-7 flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemove(entry.key)}
                          aria-label="حذف المنتج"
                          className="text-xs text-[#9C4A58] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="كود الخصم (جرّب BLENDY10)"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-black/10 text-xs focus:outline-none focus:border-[#7B61A8]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (promoInput.trim().toUpperCase() === 'BLENDY10') {
                      setPromoApplied(true);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#EFECE6] hover:bg-[#E4DFD5] text-xs font-bold text-[#1F1B24] cursor-pointer"
                >
                  {promoApplied ? 'مُفعّل ✓' : 'تطبيق'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && checkoutStep !== 'done' && (
          <div className="p-6 border-t border-black/[0.08] bg-[#FAF8F5] space-y-3 tabular-nums">
            <div className="space-y-1.5 text-xs text-[#5E5768]">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span>{subtotal} ر.س</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-[#2E7D4F] font-semibold">
                  <span>خصم BLENDY10 (١٠٪)</span>
                  <span>−{discount} ر.س</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>التوصيل المبرد</span>
                <span>{deliveryFee === 0 ? 'مجاني' : `${deliveryFee} ر.س`}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#1F1B24] pt-2 border-t border-black/[0.08]">
                <span>الإجمالي</span>
                <span>{total} ر.س</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <button
                type="button"
                onClick={() => setCheckoutStep('form')}
                className="w-full py-3.5 bg-[#1F1B24] hover:bg-[#342D3E] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                إتمام الطلب
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 py-3.5 bg-white border border-black/10 text-xs font-bold rounded-xl cursor-pointer"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 py-3.5 bg-[#1F1B24] hover:bg-[#342D3E] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
                >
                  تأكيد الطلب الآن
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
};

/* ---------------- Register / Account Modal ---------------- */
interface RegisterModalProps {
  open: boolean;
  currentUser: string | null;
  onClose: () => void;
  onAuthSuccess: (name: string) => void;
  onLogout: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  currentUser,
  onClose,
  onAuthSuccess,
  onLogout,
}) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName =
      name.trim() || email.split('@')[0] || 'عضو بليندي';
    onAuthSuccess(displayName);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-5 left-5 w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center text-[#1F1B24] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          <div className="py-4 text-center">
            <h3 className="font-ruqaa text-4xl font-bold text-[#1F1B24] mb-2">
              أهلاً بك، {currentUser}
            </h3>
            <p className="text-sm text-[#635B6E] mb-6">
              حسابك مفعّل ويمكنك الاستفادة من كود BLENDY10 لخصم ١٠٪ على طلبك القادم.
            </p>
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-3 rounded-xl border border-black/15 text-sm font-bold text-[#1F1B24] hover:bg-[#FAF8F5] cursor-pointer"
            >
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-ruqaa text-4xl font-bold text-[#1F1B24] mb-1.5">
              {mode === 'register' ? 'انضم إلى بليندي' : 'تسجيل الدخول'}
            </h3>
            <p className="text-sm text-[#675F73] mb-6">
              {mode === 'register'
                ? 'أنشئ حسابك لمتابعة طلباتك والحصول على باقات التوفير الخاصة.'
                : 'سجّل دخولك للوصول السريع إلى عناوينك وطلباتك.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#1F1B24] mb-1.5">
                    الاسم الأول
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:border-[#7B61A8]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1F1B24] mb-1.5">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-left focus:outline-none focus:border-[#7B61A8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1B24] mb-1.5">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm text-left focus:outline-none focus:border-[#7B61A8]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1F1B24] hover:bg-[#342D3E] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                {mode === 'register' ? 'إنشاء الحساب' : 'دخول'}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-[#675F73]">
              {mode === 'register' ? (
                <>
                  لديك حساب بالفعل؟{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-bold text-[#1F1B24] underline cursor-pointer"
                  >
                    تسجيل الدخول
                  </button>
                </>
              ) : (
                <>
                  مستخدم جديد؟{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="font-bold text-[#1F1B24] underline cursor-pointer"
                  >
                    إنشاء حساب جديد
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
