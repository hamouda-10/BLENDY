import React, { useState } from 'react';
import { HERO_FLAVOURS, ItemBox, ProductItem } from '../data/blendyData';

function getSheet(key?: string) {
  return HERO_FLAVOURS.find((f) => f.key === key) || HERO_FLAVOURS[0];
}

function getFixedCropStyle(sheetUrl: string, box: ItemBox, targetW: number): React.CSSProperties {
  const s = targetW / box.bw;
  return {
    width: `${targetW}px`,
    height: `${Math.round(box.bh * s)}px`,
    backgroundImage: `url("${sheetUrl}")`,
    backgroundSize: `${Math.round(2048 * s)}px ${Math.round(2048 * s)}px`,
    backgroundPosition: `${Math.round(-box.bx * s)}px ${Math.round(-box.by * s)}px`,
    backgroundRepeat: 'no-repeat',
  };
}

interface ProductVisualProps {
  product: ProductItem;
  size?: 'card' | 'modal';
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ product, size = 'card' }) => {
  const [imgError, setImgError] = useState(false);
  const scaleFactor = size === 'modal' ? 1.32 : 1;

  if (product.visualType === 'studio-photo' && product.photoSrc && !imgError) {
    return (
      <div
        className="relative w-full h-full overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: product.accentBg }}
      >
        <img
          src={product.photoSrc}
          alt={product.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  if (product.visualType === 'cutout-pack' && product.packSheets) {
    const bottles = product.packSheets;
    const bottleW = Math.round((bottles.length <= 2 ? 78 : 58) * scaleFactor);
    const gapClass = bottles.length <= 2 ? 'gap-3' : 'gap-1';

    return (
      <div
        className="relative w-full h-full overflow-hidden flex items-center justify-center select-none"
        style={{ backgroundColor: product.accentBg }}
      >
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[72%] h-5 rounded-full opacity-35 blur-md pointer-events-none"
          style={{ background: 'radial-gradient(closest-side, rgba(50,35,70,0.45), transparent)' }}
        />
        <div
          className={`relative flex items-end justify-center ${gapClass} transition-transform duration-300 ease-out group-hover:-translate-y-1`}
        >
          {bottles.map((key, idx) => {
            const fl = getSheet(key);
            const box = fl.items[0];
            const isCenter =
              bottles.length >= 3 && (idx === 1 || idx === 2);
            return (
              <div
                key={`${key}-${idx}`}
                style={{
                  ...getFixedCropStyle(fl.sheetUrl, box, bottleW),
                  transform: isCenter ? 'translateY(-6px) scale(1.05)' : undefined,
                  filter: 'drop-shadow(0 8px 14px rgba(45,30,65,0.14))',
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Single bottle + floating fruit cutouts
  const fl = getSheet(product.sheetKey);
  const bottleBox = fl.items[0];
  const bottleW = Math.round(98 * scaleFactor);
  const accents = product.fruitAccentItems || [
    { item: 1 as const, rot: -12 },
    { item: 2 as const, rot: 14 },
  ];

  return (
    <div
      className="relative w-full h-full overflow-hidden flex items-center justify-center select-none"
      style={{ backgroundColor: product.accentBg }}
    >
      {/* Soft floor shadow */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 w-36 h-4 rounded-full blur-[4px] pointer-events-none"
        style={{ background: 'radial-gradient(closest-side, rgba(60,40,80,0.22), transparent)' }}
      />

      {/* Left fruit accent */}
      {accents[0] && (
        <div
          className="absolute transition-transform duration-300 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1 pointer-events-none"
          style={{
            left: size === 'modal' ? '16%' : '14%',
            bottom: size === 'modal' ? '22%' : '18%',
            ...getFixedCropStyle(fl.sheetUrl, fl.items[accents[0].item], Math.round(48 * scaleFactor)),
            transform: `rotate(${accents[0].rot}deg)`,
            filter: 'drop-shadow(0 6px 10px rgba(45,30,65,0.14))',
          }}
        />
      )}

      {/* Right fruit accent */}
      {accents[1] && (
        <div
          className="absolute transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 pointer-events-none"
          style={{
            right: size === 'modal' ? '15%' : '13%',
            top: size === 'modal' ? '20%' : '18%',
            ...getFixedCropStyle(fl.sheetUrl, fl.items[accents[1].item], Math.round(44 * scaleFactor)),
            transform: `rotate(${accents[1].rot}deg)`,
            filter: 'drop-shadow(0 6px 10px rgba(45,30,65,0.14))',
          }}
        />
      )}

      {/* Main Bottle */}
      <div
        className="relative z-[1] transition-transform duration-300 ease-out group-hover:-translate-y-1.5"
        style={{
          ...getFixedCropStyle(fl.sheetUrl, bottleBox, bottleW),
          filter: 'drop-shadow(0 12px 18px rgba(45,30,65,0.14))',
        }}
      />
    </div>
  );
};
