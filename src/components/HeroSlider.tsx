import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FLOOR_SHADOWS,
  FlavourKey,
  HERO_FLAVOURS,
  HeroFlavourSpec,
  ItemBox,
} from '../data/blendyData';

const COVER_TABLE: Array<[number, number]> = [
  [0, 0],
  [0.031, 0.006],
  [0.134, 0.012],
  [0.206, 0.023],
  [0.278, 0.047],
  [0.34, 0.07],
  [0.412, 0.105],
  [0.485, 0.158],
  [0.546, 0.246],
  [0.583, 0.55],
  [0.62, 0.825],
  [0.69, 0.9],
  [0.79, 0.94],
  [0.85, 0.956],
  [0.93, 0.975],
  [1, 1],
];

function sampleCover(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  for (let i = 0; i < COVER_TABLE.length - 1; i++) {
    const [t0, c0] = COVER_TABLE[i];
    const [t1, c1] = COVER_TABLE[i + 1];
    if (t >= t0 && t <= t1) {
      const k = (t - t0) / (t1 - t0);
      const smooth = 3 * k * k - 2 * k * k * k;
      return c0 + (c1 - c0) * smooth;
    }
  }
  return 1;
}

function easeOutQuad(x: number): number {
  const c = Math.max(0, Math.min(1, x));
  return 1 - (1 - c) * (1 - c);
}

function cropStyle(
  sheetUrl: string,
  box: ItemBox,
  targetW: number
): React.CSSProperties {
  const s = targetW / box.bw;
  const h = box.bh * s;
  const bgSize = 2048 * s;
  const bgX = -box.bx * s;
  const bgY = -box.by * s;
  return {
    width: `calc(${targetW} * var(--u))`,
    height: `calc(${h} * var(--u))`,
    backgroundImage: `url("${sheetUrl}")`,
    backgroundSize: `calc(${bgSize} * var(--u)) calc(${bgSize} * var(--u))`,
    backgroundPosition: `calc(${bgX} * var(--u)) calc(${bgY} * var(--u))`,
    backgroundRepeat: 'no-repeat',
  };
}

interface WordMetrics {
  fontSize: number;
  top: number;
}

interface HeroSliderProps {
  activeIndex: number;
  onActiveChange: (index: number) => void;
  cartCount: number;
  userName: string | null;
  onOpenCart: () => void;
  onOpenRegister: () => void;
  onShopNow: (flavourKey: FlavourKey) => void;
  heroRef: React.RefObject<HTMLElement | null>;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  activeIndex,
  onActiveChange,
  cartCount,
  userName,
  onOpenCart,
  onOpenRegister,
  onShopNow,
  heroRef,
}) => {
  const [wordMetrics, setWordMetrics] = useState<Record<string, WordMetrics>>({
    berry: { fontSize: 445, top: 181 },
    kiwi: { fontSize: 445, top: 181 },
    banana: { fontSize: 445, top: 181 },
    strawberry: { fontSize: 380, top: 213 },
  });
  const [uiVisible, setUiVisible] = useState(false);
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const layerRefs = useRef<
    Array<{
      word: HTMLDivElement | null;
      shadow: HTMLDivElement | null;
      bottle: HTMLDivElement | null;
      fruit: HTMLDivElement | null;
      corner: HTMLDivElement | null;
    }>
  >(
    HERO_FLAVOURS.map(() => ({
      word: null,
      shadow: null,
      bottle: null,
      fruit: null,
      corner: null,
    }))
  );
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabsWrapRef = useRef<HTMLDivElement | null>(null);

  const currentIdxRef = useRef(activeIndex);
  const isTransitioningRef = useRef(false);
  const lastInteractionRef = useRef(0);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const frameWidthPxRef = useRef(1440);
  const reducedMotionRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const measureAndScale = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w <= 820 || h > w;

    const u = isMobile
      ? Math.min(w / 640, Math.max(120, h - 200) / 620)
      : Math.min(w / 1440, h / 900);
    const fy = isMobile ? 8 : 0;

    document.documentElement.style.setProperty('--u', `${u}px`);
    document.documentElement.style.setProperty('--fy', `${fy}px`);
    frameWidthPxRef.current = 1440 * u;

    // Measure giant Arabic Ruqaa word for each flavour
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = '700 100px "Aref Ruqaa", serif';
      const maxWidth = isMobile
        ? Math.min(1440, w / Math.max(0.1, u)) * 0.9
        : 1330;

      const nextMetrics: Record<string, WordMetrics> = {};
      for (const fl of HERO_FLAVOURS) {
        const m = ctx.measureText(fl.arabicName);
        const inkW100 = Math.max(
          m.width,
          (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || 0)
        );
        let F = 445;
        if (inkW100 * 4.45 > maxWidth) {
          const targetFill = isMobile ? maxWidth : 1380;
          F = Math.min(445, (targetFill / Math.max(1, inkW100)) * 100);
        }
        const baseline = 403.5 + (0.698 * F) / 2;
        const top = baseline - 0.85 * F;
        nextMetrics[fl.key] = { fontSize: F, top };
      }
      setWordMetrics(nextMetrics);
    }
  }, []);

  const syncUnderline = useCallback((idx: number) => {
    const tab = tabRefs.current[idx];
    if (tab) {
      setUnderlineStyle({
        left: tab.offsetLeft,
        width: tab.offsetWidth,
      });
    }
  }, []);

  // Preload 4 sheets on mount
  useEffect(() => {
    HERO_FLAVOURS.forEach((f) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = f.sheetUrl;
    });
  }, []);

  // Setup reduced motion, resize, fonts ready & opening sequence
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mq.matches;
    const onMqChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener('change', onMqChange);

    measureAndScale();
    syncUnderline(currentIdxRef.current);

    const onResize = () => {
      measureAndScale();
      requestAnimationFrame(() => syncUnderline(currentIdxRef.current));
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Initialize slide visibility
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === currentIdxRef.current) {
        el.style.visibility = 'visible';
        el.style.zIndex = '2';
      } else {
        el.style.visibility = 'hidden';
        el.style.zIndex = '0';
      }
    });

    // Opening sequence after fonts.ready
    let cancelled = false;
    const failsafe = window.setTimeout(() => {
      if (!cancelled) setUiVisible(true);
    }, 3000);

    document.fonts.ready.then(() => {
      if (cancelled) return;
      measureAndScale();
      syncUnderline(currentIdxRef.current);

      if (reducedMotionRef.current) {
        setUiVisible(true);
        return;
      }

      const fw = frameWidthPxRef.current;
      const firstLayers = layerRefs.current[0];
      const factors: Array<[keyof typeof firstLayers, number]> = [
        ['word', 0.4],
        ['shadow', 0.3],
        ['bottle', 0.15],
        ['fruit', 0.55],
        ['corner', 0.75],
      ];

      factors.forEach(([key, factor]) => {
        const el = firstLayers[key];
        if (!el) return;
        el.animate(
          [
            { transform: `translate3d(${factor * fw}px, 0, 0)` },
            { transform: 'translate3d(0, 0, 0)' },
          ],
          {
            duration: 900,
            easing: 'cubic-bezier(0.22, 0.8, 0.3, 1)',
            fill: 'both',
          }
        );
      });

      requestAnimationFrame(() => {
        if (!cancelled) setUiVisible(true);
      });
    });

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      window.removeEventListener('resize', onResize);
      mq.removeEventListener('change', onMqChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [measureAndScale, syncUnderline]);

  const goToFlavour = useCallback(
    (targetIdx: number, explicitDir?: 1 | -1, isUserAction = true) => {
      if (isUserAction) {
        lastInteractionRef.current = performance.now();
      }
      const total = HERO_FLAVOURS.length;
      const nextIdx = ((targetIdx % total) + total) % total;
      const prevIdx = currentIdxRef.current;
      if (nextIdx === prevIdx || isTransitioningRef.current) return;

      const dir: 1 | -1 =
        explicitDir ?? (nextIdx > prevIdx ? 1 : -1);

      currentIdxRef.current = nextIdx;
      onActiveChange(nextIdx);
      syncUnderline(nextIdx);

      const slideA = slideRefs.current[prevIdx];
      const slideB = slideRefs.current[nextIdx];
      const layersA = layerRefs.current[prevIdx];
      const layersB = layerRefs.current[nextIdx];

      if (!slideA || !slideB) return;

      // Reduced motion: instant swap
      if (reducedMotionRef.current) {
        slideA.style.visibility = 'hidden';
        slideA.style.zIndex = '0';
        slideA.style.clipPath = '';
        slideB.style.visibility = 'visible';
        slideB.style.zIndex = '2';
        slideB.style.clipPath = '';
        return;
      }

      isTransitioningRef.current = true;

      slideB.style.visibility = 'visible';
      slideB.style.zIndex = '1';
      slideB.style.clipPath = '';
      slideA.style.visibility = 'visible';
      slideA.style.zIndex = '2';

      const duration = 970;
      const startTime = performance.now();
      const fw = frameWidthPxRef.current;

      const factors: Array<[keyof typeof layersA, number]> = [
        ['word', 0.4],
        ['shadow', 0.3],
        ['bottle', 0.15],
        ['fruit', 0.55],
        ['corner', 0.75],
      ];

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = elapsed / duration;
        const tClamped = Math.min(1, t);
        const c = sampleCover(tClamped);

        // Cover A
        const clipPct = (c * 100).toFixed(3);
        slideA.style.clipPath =
          dir === 1
            ? `inset(0 ${clipPct}% 0 0)`
            : `inset(0 0 0 ${clipPct}%)`;

        // Drift A away
        const driftX = -dir * c * 0.14 * fw;
        const driftTransform = `translate3d(${driftX.toFixed(2)}px, 0, 0)`;
        for (const [key] of factors) {
          const elA = layersA[key];
          if (elA) elA.style.transform = driftTransform;
        }

        // Parallax B arrive
        const kRaw = (t - 0.5) / 0.42;
        const k = easeOutQuad(kRaw);
        for (const [key, factor] of factors) {
          const elB = layersB[key];
          if (elB) {
            const offset = dir * (1 - k) * factor * fw;
            elB.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
          }
        }

        if (tClamped < 1 || k < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          // Finish & clear
          slideB.style.zIndex = '2';
          slideB.style.clipPath = '';
          slideA.style.visibility = 'hidden';
          slideA.style.zIndex = '0';
          slideA.style.clipPath = '';

          for (const [key] of factors) {
            if (layersA[key]) layersA[key]!.style.transform = '';
            if (layersB[key]) layersB[key]!.style.transform = '';
          }

          isTransitioningRef.current = false;
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(step);
    },
    [onActiveChange, syncUnderline]
  );

  // Autoplay every 2600ms if page visible and no interaction in last 6000ms
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (performance.now() - lastInteractionRef.current < 6000) return;
      // Pause autoplay if user scrolled way past hero
      if (window.scrollY > window.innerHeight * 0.65) return;
      goToFlavour(currentIdxRef.current + 1, 1, false);
    }, 2600);

    return () => window.clearInterval(interval);
  }, [goToFlavour]);

  // Keyboard ArrowLeft / ArrowRight
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        goToFlavour(currentIdxRef.current - 1, -1, true);
      } else if (e.key === 'ArrowRight') {
        goToFlavour(currentIdxRef.current + 1, 1, true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goToFlavour]);

  // Pointer swipe on stage
  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const onPointerUp = (e: PointerEvent) => {
      const start = pointerStartRef.current;
      if (!start) return;
      pointerStartRef.current = null;

      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          goToFlavour(currentIdxRef.current + 1, 1, true);
        } else {
          goToFlavour(currentIdxRef.current - 1, -1, true);
        }
      }
    };
    window.addEventListener('pointerup', onPointerUp);
    return () => window.removeEventListener('pointerup', onPointerUp);
  }, [goToFlavour]);

  const currentFlavour: HeroFlavourSpec = HERO_FLAVOURS[activeIndex];

  return (
    <section
      ref={heroRef}
      className="blendy-hero"
      aria-label="معرض نكهات سموذي بليندي"
      onPointerDown={handlePointerDown}
    >
      {/* Stacked slides */}
      {HERO_FLAVOURS.map((flavour, idx) => {
        const wm = wordMetrics[flavour.key] || { fontSize: 445, top: 181 };
        const bottleBox = flavour.items[0];
        const fruitPieces = flavour.pieces.filter((p) => p.layer === 'fruit');
        const cornerPieces = flavour.pieces.filter((p) => p.layer === 'corner');

        return (
          <div
            key={flavour.key}
            ref={(el) => {
              slideRefs.current[idx] = el;
            }}
            className="blendy-slide"
            style={{
              backgroundColor: flavour.backdrop,
              visibility: idx === 0 ? 'visible' : 'hidden',
              zIndex: idx === 0 ? 2 : 0,
            }}
            aria-hidden={activeIndex !== idx}
          >
            <div className="blendy-frame">
              {/* Layer 1: Giant Arabic Ruqaa Flavour Word */}
              <div
                ref={(el) => {
                  layerRefs.current[idx].word = el;
                }}
                className="blendy-layer"
              >
                <div
                  className="blendy-word"
                  style={{
                    fontSize: `calc(${wm.fontSize} * var(--u))`,
                    top: `calc(${wm.top} * var(--u))`,
                  }}
                >
                  {flavour.arabicName}
                </div>
              </div>

              {/* Layer 2: Floor Shadows */}
              <div
                ref={(el) => {
                  layerRefs.current[idx].shadow = el;
                }}
                className="blendy-layer"
              >
                {FLOOR_SHADOWS.map((sh) => (
                  <div
                    key={sh.id}
                    className="blendy-floor-shadow"
                    style={{
                      left: `calc(${sh.cx - sh.w / 2} * var(--u))`,
                      top: `calc(${sh.cy - sh.h / 2} * var(--u))`,
                      width: `calc(${sh.w} * var(--u))`,
                      height: `calc(${sh.h} * var(--u))`,
                    }}
                  />
                ))}
              </div>

              {/* Layer 3: Smoothie Bottle (never bobs) */}
              <div
                ref={(el) => {
                  layerRefs.current[idx].bottle = el;
                }}
                className="blendy-layer"
              >
                <div
                  style={{
                    position: 'absolute',
                    left: `calc(${flavour.bottle.x} * var(--u))`,
                    top: `calc(${flavour.bottle.y} * var(--u))`,
                    ...cropStyle(flavour.sheetUrl, bottleBox, flavour.bottle.w),
                  }}
                />
              </div>

              {/* Layer 4: Sharp Mid-size Floating Fruit Pieces */}
              <div
                ref={(el) => {
                  layerRefs.current[idx].fruit = el;
                }}
                className="blendy-layer"
              >
                {fruitPieces.map((piece) => {
                  const box = flavour.items[piece.item];
                  const styleCrop = cropStyle(flavour.sheetUrl, box, piece.w);
                  return (
                    <div
                      key={piece.id}
                      style={{
                        position: 'absolute',
                        left: `calc(${piece.x} * var(--u))`,
                        top: `calc(${piece.y} * var(--u))`,
                        width: styleCrop.width,
                        height: styleCrop.height,
                        transform: piece.mirror ? 'scaleX(-1)' : undefined,
                      }}
                    >
                      <div
                        className="blendy-fruit-inner"
                        style={
                          {
                            ...styleCrop,
                            width: '100%',
                            height: '100%',
                            '--rot': `${piece.rotation}deg`,
                            '--dur': `${piece.bobDuration}s`,
                            '--delay': `${piece.bobDelay}s`,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  );
                })}
              </div>

              {/* Layer 5: Blurred Corner Fruit Pieces */}
              <div
                ref={(el) => {
                  layerRefs.current[idx].corner = el;
                }}
                className="blendy-layer blendy-corner-layer"
              >
                {cornerPieces.map((piece) => {
                  const box = flavour.items[piece.item];
                  const styleCrop = cropStyle(flavour.sheetUrl, box, piece.w);
                  return (
                    <div
                      key={piece.id}
                      style={{
                        position: 'absolute',
                        left: `calc(${piece.x} * var(--u))`,
                        top: `calc(${piece.y} * var(--u))`,
                        width: styleCrop.width,
                        height: styleCrop.height,
                        transform: piece.mirror ? 'scaleX(-1)' : undefined,
                      }}
                    >
                      <div
                        className="blendy-fruit-inner"
                        style={
                          {
                            ...styleCrop,
                            width: '100%',
                            height: '100%',
                            '--rot': `${piece.rotation}deg`,
                            '--dur': `${piece.bobDuration}s`,
                            '--delay': `${piece.bobDelay}s`,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Fixed UI Layer inside Hero */}
      <div className="blendy-ui">
        <header className="blendy-ui-header">
          <a
            href="#catalog"
            onClick={(e) => {
              e.preventDefault();
              goToFlavour(0, activeIndex > 0 ? -1 : 1, true);
            }}
            className={`blendy-logo blendy-ui-reveal ${uiVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '250ms' }}
          >
            بليندي
          </a>

          <nav
            ref={tabsWrapRef}
            aria-label="نكهات السموذي"
            className={`blendy-tabs-wrap blendy-ui-reveal ${uiVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '330ms' }}
          >
            {HERO_FLAVOURS.map((fl, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={fl.key}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  type="button"
                  className="blendy-tab"
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => {
                    const dir = idx > currentIdxRef.current ? 1 : -1;
                    goToFlavour(idx, dir, true);
                  }}
                >
                  {fl.arabicName}
                </button>
              );
            })}
            <span
              className="blendy-underline"
              aria-hidden="true"
              style={{
                width: `${underlineStyle.width}px`,
                transform: `translate3d(${underlineStyle.left}px, 0, 0)`,
              }}
            />
          </nav>

          <div
            className={`blendy-account blendy-ui-reveal ${uiVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '410ms' }}
          >
            <button type="button" onClick={onOpenCart}>
              السلة{cartCount > 0 ? ` (${cartCount})` : ''}
            </button>
            <span aria-hidden="true" style={{ opacity: 0.9 }}>
              |
            </span>
            <button type="button" onClick={onOpenRegister}>
              {userName ? `أهلاً، ${userName}` : 'التسجيل'}
            </button>
          </div>
        </header>

        <button
          type="button"
          aria-label="النكهة السابقة"
          className={`blendy-arrow blendy-arrow-prev blendy-ui-reveal ${
            uiVisible ? 'is-visible' : ''
          }`}
          style={{ transitionDelay: '490ms' }}
          onClick={() => goToFlavour(currentIdxRef.current - 1, -1, true)}
        >
          <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 14H4 M12 6l-8 8 8 8" />
          </svg>
        </button>

        <a
          href="#catalog"
          onClick={(e) => {
            e.preventDefault();
            onShopNow(currentFlavour.key);
          }}
          className={`blendy-shop-now blendy-ui-reveal ${
            uiVisible ? 'is-visible' : ''
          }`}
          style={{ transitionDelay: '570ms' }}
        >
          <span>تسوّق الآن</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>

        <button
          type="button"
          aria-label="النكهة التالية"
          className={`blendy-arrow blendy-arrow-next blendy-ui-reveal ${
            uiVisible ? 'is-visible' : ''
          }`}
          style={{ transitionDelay: '650ms' }}
          onClick={() => goToFlavour(currentIdxRef.current + 1, 1, true)}
        >
          <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 14h20 M16 6l8 8-8 8" />
          </svg>
        </button>
      </div>
    </section>
  );
};
