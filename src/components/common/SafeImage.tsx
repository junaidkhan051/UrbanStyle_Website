import React, { useState } from 'react';
import { LOCAL_IMAGES } from '../../assets/images';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  category?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackTitle,
  category,
  className = '',
  ...props
}) => {
  const [triedFallback, setTriedFallback] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine appropriate local fallback image
  const getCategoryFallback = () => {
    switch (category?.toLowerCase()) {
      case 'women':
        return LOCAL_IMAGES.women;
      case 'kids':
        return LOCAL_IMAGES.kids;
      case 'footwear':
        return LOCAL_IMAGES.sneakers;
      case 'accessories':
        return LOCAL_IMAGES.footwearAccessories;
      default:
        return LOCAL_IMAGES.tshirt;
    }
  };

  const handleError = () => {
    if (!triedFallback) {
      setTriedFallback(true);
    } else {
      setHasError(true);
    }
  };

  const imageSrc = triedFallback ? getCategoryFallback() : (src || getCategoryFallback());

  if (hasError) {
    return (
      <div
        className={`w-full h-full min-h-[140px] flex flex-col items-center justify-center p-5 bg-[#F4F2ED] text-neutral-800 text-center select-none relative overflow-hidden ${className}`}
        role="img"
        aria-label={alt || fallbackTitle || 'Product Preview'}
      >
        <div className="absolute inset-0 opacity-10 flex items-center justify-center font-serif text-5xl font-black tracking-widest uppercase pointer-events-none text-neutral-900">
          URBANSTYLE
        </div>
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-500 mb-1 z-10">
          {category || 'Collection'}
        </span>
        <span className="text-xs font-serif font-semibold line-clamp-2 text-neutral-800 z-10">
          {fallbackTitle || alt || 'Contemporary Style'}
        </span>
        <span className="text-[10px] text-neutral-400 mt-2 font-mono tracking-wider z-10">
          EST. 2026
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-100">
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-200/50 animate-pulse" />
      )}
      <img
        src={imageSrc}
        alt={alt || 'UrbanStyle fashion product'}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
