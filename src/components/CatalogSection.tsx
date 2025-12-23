import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { HiOutlineHeart, HiHeart, HiChevronLeft, HiChevronRight, HiBars3 } from 'react-icons/hi2';
import { HiOutlineViewGrid } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';

// Ürün tipi
interface Product {
  id: number;
  code: string;
  name: string;
  category: 'bebek' | 'cocuk';
  ageRange: string;
  image: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
}

// URL'den JSON dosyasını okuyan fonksiyon
const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/urunler.json');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Hata durumunda boş dizi dön
    return [];
  }
};

const whatsappNumber = '905369205969';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Skeleton Kart Komponenti
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-lg animate-pulse">
    <div className="aspect-square bg-slate-200" />
    <div className="p-2 sm:p-3">
      <div className="h-3 sm:h-4 bg-slate-200 rounded w-3/4 mb-1.5 sm:mb-2" />
      <div className="h-2.5 sm:h-3 bg-slate-200 rounded w-1/2 mb-2 sm:mb-3" />
      <div className="h-8 sm:h-10 bg-slate-200 rounded mt-1 sm:mt-2" />
    </div>
  </div>
);

// Confetti Particle
const ConfettiParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{
      background: `hsl(${Math.random() * 60 + 340}, 80%, 60%)`,
    }}
    initial={{ scale: 0, x: 0, y: 0 }}
    animate={{
      scale: [0, 1, 0],
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
      opacity: [0, 1, 0],
    }}
    transition={{ duration: 0.6, delay }}
  />
);

// Ürün Kartı Komponenti
interface ProductCardProps {
  product: Product;
  index: number;
  isFavorite: boolean;
  viewMode: 'grid' | 'list';
  onToggleFavorite: (product: Product) => void;
  onQuickView: (product: Product) => void;
  lang: 'tr' | 'en';
  mode?: 'home' | 'full';
}

const ProductCard = ({ product, index, isFavorite, viewMode, onToggleFavorite, onQuickView, lang, mode }: ProductCardProps & { mode?: 'home' | 'full' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isFavorite) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 700);
      const t = translations[lang];
      toast.success(`${product.name} ${t.addedToFavorites}`, {
        icon: '❤️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } else {
      const t = translations[lang];
      toast.success(`${product.name} ${t.removedFromFavorites}`, {
        icon: '💔',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }

    onToggleFavorite(product);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`product-card group bg-white rounded-2xl overflow-hidden border shadow-lg hover:shadow-xl cursor-pointer relative transition-all duration-300 ${
        viewMode === 'list'
          ? 'flex items-center gap-4 p-4'
          : 'border-slate-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView(product)}
      whileHover={{ y: viewMode === 'list' ? 0 : -4, scale: 1 }}
      whileTap={{ scale: 0.98 }}
    >

      {/* Ürün Görseli */}
      <div ref={imageRef} className={`relative overflow-hidden bg-slate-100 ${
        viewMode === 'list' ? 'w-24 h-24 sm:w-28 sm:h-28 rounded-lg' : 'aspect-square'
      }`}>
        {/* Loading Placeholder */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}

        {/* Lazy Loaded Image */}
        {inView && (
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: isImageLoaded ? 1 : 0 }}
            animate={{ scale: isHovered && viewMode !== 'list' ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => {
              setIsImageLoaded(true);
              (e.target as HTMLImageElement).src = '/images/placeholder.png';
            }}
          />
        )}

        {/* Ürün Kodu Badge */}
        {viewMode !== 'list' && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-full text-[10px] sm:text-xs font-bold bg-pink-500/90 text-white backdrop-blur-sm">
              {product.code}
            </span>
          </div>
        )}

        {/* Favori Butonu */}
        <motion.button
          className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm z-10"
          onClick={handleFavoriteClick}
          whileTap={{ scale: 1.3 }}
        >
          <motion.div
            animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {isFavorite ? (
              <HiHeart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            ) : (
              <HiOutlineHeart className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            )}
          </motion.div>

          {/* Confetti efekti */}
          {showConfetti && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <ConfettiParticle key={i} delay={i * 0.05} />
              ))}
            </div>
          )}
        </motion.button>
      </div>

      {/* Ürün Bilgileri */}
      <div className={`${
        viewMode === 'list'
          ? 'flex-1 flex items-center justify-between'
          : 'p-2 sm:p-3'
      }`}>
        <div className={viewMode === 'list' ? 'flex-1' : ''}>
          {/* Product Code for List View */}
          {viewMode === 'list' && (
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-1 bg-pink-500/10 text-pink-500 text-xs font-bold rounded-md">
                {product.code}
              </span>
              <span className="text-xs text-slate-500">{product.ageRange}</span>
            </div>
          )}

          {mode !== 'home' && (
            <h3 className={`font-semibold text-slate-800 leading-tight mb-0.5 sm:mb-1 line-clamp-${
              viewMode === 'list' ? '1' : '1 sm:2'
            } ${
              viewMode === 'list' ? 'text-base' : 'text-xs sm:text-sm'
            }`}>
              {product.name}
            </h3>
          )}

          {viewMode !== 'list' && (
            <p className="text-[10px] sm:text-xs text-slate-500 mb-2 sm:mb-3">{product.ageRange}</p>
          )}
        </div>

        {/* Soru Sor Butonu */}
        <motion.a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(translations[lang].whatsappCard.replace('{code}', product.code))}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`bg-green-500 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 relative overflow-hidden transition-all ${
            viewMode === 'list'
              ? 'px-4 py-2 text-sm'
              : 'w-full py-2 sm:py-2.5 text-[10px] sm:text-xs'
          }`}
          onClick={(e) => e.stopPropagation()}
          whileHover={{ backgroundColor: '#16a34a' }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>{viewMode === 'list' ? translations[lang].getQuote : translations[lang].askQuestion}</span>
        </motion.a>
      </div>
    </motion.article>
  );
};

// Quick View Modal
interface QuickViewModalProps {
  product: Product | null;
  products: Product[];
  onClose: () => void;
  onNavigate: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  mode?: 'home' | 'full';
  lang: 'tr' | 'en';
}

const QuickViewModal = ({ product, products, onClose, onNavigate, isFavorite, onToggleFavorite, mode = 'full', lang }: QuickViewModalProps) => {
  const [direction, setDirection] = useState(0);
  const [imageKey, setImageKey] = useState(0);

  if (!product) return null;

  // Mevcut ürünün index'ini bul
  const currentIndex = products.findIndex(p => p.id === product.id);

  // Önceki ürüne git (infinite loop for full mode, limited for home)
  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(-1);
    let prevIndex: number;

    if (mode === 'home') {
      // Home mode: don't loop, just go to previous
      prevIndex = currentIndex <= 0 ? 0 : currentIndex - 1;
    } else {
      // Full mode: infinite loop
      prevIndex = currentIndex <= 0 ? products.length - 1 : currentIndex - 1;
    }

    setImageKey(prev => prev + 1);
    onNavigate(products[prevIndex]);
  };

  // Sonraki ürüne git (limited for home mode)
  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(1);
    let nextIndex: number;

    if (mode === 'home') {
      // Home mode: don't loop
      nextIndex = Math.min(currentIndex + 1, products.length - 1);
    } else {
      // Full mode: infinite loop
      nextIndex = currentIndex >= products.length - 1 ? 0 : currentIndex + 1;
    }

    setImageKey(prev => prev + 1);
    onNavigate(products[nextIndex]);
  };

  // Swipe handler
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      handlePrev();
    } else if (info.offset.x < -swipeThreshold) {
      handleNext();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, products]);

  // Image animation variants
  const imageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal Content */}
      <motion.div
        className="relative bg-white rounded-2xl overflow-hidden max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Sağ üstte, z-index yüksek */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-30 hover:bg-black/60 transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Favorite Button - Sol üstte */}
        <button
          onClick={() => onToggleFavorite(product)}
          className="absolute top-3 left-3 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-30 hover:bg-black/60 transition-colors"
        >
          {isFavorite ? (
            <HiHeart className="w-5 h-5 text-red-500" />
          ) : (
            <HiOutlineHeart className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Product Image with Navigation */}
        <div className="relative aspect-square bg-slate-100 overflow-hidden">
          {/* Swipeable Image */}
          <motion.div
            className="w-full h-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={imageKey}
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder.png';
                }}
                draggable={false}
              />
            </AnimatePresence>
          </motion.div>

          {/* Navigation Arrows - Görselin ortasında */}
          {products.length > 1 && (
            <>
              {/* Prev Button */}
              <motion.button
                onClick={handlePrev}
                className={`absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-20 transition-all ${
                  mode === 'home' && currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={mode === 'home' && currentIndex === 0}
              >
                <HiChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700" />
              </motion.button>

              {/* Next Button */}
              <motion.button
                onClick={handleNext}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-20 transition-all ${
                  mode === 'home' && currentIndex >= products.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={mode === 'home' && currentIndex >= products.length - 1}
              >
                <HiChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700" />
              </motion.button>
            </>
          )}

          {/* Product Code Badge */}
          <div className="absolute bottom-4 left-4 z-10">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-pink-500 text-white shadow-md">
              {product.code}
            </span>
          </div>

          {/* Page Indicator */}
          {products.length > 1 && (
            <div className="absolute bottom-4 right-4 z-10">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
                {currentIndex + 1} / {products.length}
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <motion.div
          className="p-6"
          key={product.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-bold text-slate-800 mb-2">{product.name}</h2>
          <p className="text-sm text-slate-500 mb-4">{product.ageRange}</p>

          {product.description && (
            <p className="text-slate-600 text-sm mb-4">{product.description}</p>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">{translations[lang].colors}</h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span key={color} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">{translations[lang].sizes}</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <span key={size} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp Button */}
          <motion.a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(translations[lang].whatsappModalFull.replace('{code}', product.code).replace('{name}', product.name))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-green-500 text-white font-semibold rounded-xl flex items-center justify-center gap-3"
            whileHover={{ backgroundColor: '#16a34a' }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {translations[lang].whatsappModal}
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Empty State
const EmptyState = ({ hasFilterFavorites, lang }: { hasFilterFavorites?: boolean; lang: 'tr' | 'en' }) => (
  <motion.div
    className="text-center py-16"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="w-24 h-24 mx-auto mb-6 text-slate-300"
      animate={{
        rotate: [0, -10, 10, -10, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    >
      {hasFilterFavorites ? (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ) : (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      )}
    </motion.div>
    <h3 className="text-xl font-semibold text-slate-700 mb-2">
      {hasFilterFavorites ? translations[lang].noFavorites : translations[lang].noResults}
    </h3>
    <p className="text-slate-500 mb-4">
      {hasFilterFavorites
        ? translations[lang].noFavoritesDesc
        : translations[lang].noResultsDesc
      }
    </p>
    {!hasFilterFavorites && (
      <p className="text-sm text-slate-400">{translations[lang].tryDifferentKeywords}</p>
    )}
  </motion.div>
);

// Animated Counter
const AnimatedCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const duration = 300;
    const startValue = displayValue;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentValue = Math.round(startValue + (value - startValue) * progress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <motion.span
      key={value}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-pink-500 font-bold"
    >
      {displayValue}
    </motion.span>
  );
};


// Dil metinleri
type TranslationsType = typeof translations;
const translations: Record<'tr' | 'en', {
  sectionTitleHome: string;
  sectionTitleFull: string;
  collectionBadge: string;
  sectionDescHome: string;
  sectionDescFull: string;
  all: string;
  baby: string;
  child: string;
  favorites: string;
  searchPlaceholder: string;
  productsFound: string;
  gridView: string;
  listView: string;
  askQuestion: string;
  getQuote: string;
  goToCatalog: string;
  productsCount: string;
  previous: string;
  next: string;
  pageInfo: string;
  productsWord: string;
  noResults: string;
  noResultsDesc: string;
  clearFilters: string;
  noFavorites: string;
  noFavoritesDesc: string;
  tryDifferentKeywords: string;
  addedToFavorites: string;
  removedFromFavorites: string;
  redirectBadge: string;
  redirectTitle: string;
  redirectDesc: string;
  redirectButton: string;
  redirectLink: string;
  redirectName: string;
  whatsappModal: string;
  colors: string;
  sizes: string;
  whatsappCard: string;
  whatsappModalFull: string;
  loadError: string;
}> = {
  tr: {
    // Section titles
    sectionTitleHome: 'Ürünler',
    sectionTitleFull: 'Ürün Kataloğu',
    collectionBadge: '2026 Koleksiyonu',
    sectionDescHome: '',
    sectionDescFull: 'Bebek ve çocuk çoraplarımızı inceleyin',
    
    // Filters
    all: 'Tümü',
    baby: 'Bebek Çorapları',
    child: 'Çocuk Çorapları',
    favorites: 'Favoriler',
    searchPlaceholder: 'Ürün kodu veya isim ara... (örn: KOD-14)',
    productsFound: 'ürün bulundu',
    
    // Buttons
    gridView: 'Geniş Kart Görünümü',
    listView: 'Kompakt Liste Görünümü',
    askQuestion: 'Soru Sor',
    getQuote: 'Teklif Al',
    goToCatalog: 'Kataloğa Git',
    productsCount: '+ ürün',
    
    // Pagination
    previous: 'Önceki',
    next: 'Sonraki',
    pageInfo: '. sayfa - Toplam',
    productsWord: 'ürün',
    
    // Empty state
    noResults: 'Aranızla eşleşen ürün bulunamadı',
    noResultsDesc: 'Filtreleri temizleyip tekrar deneyin.',
    clearFilters: 'Filtreleri Temizle',
    noFavorites: 'Henüz favori ürününüz bulunmuyor',
    noFavoritesDesc: 'Kalp ikonuna tıklayarak ürünleri favorilerinize ekleyebilirsiniz.',
    tryDifferentKeywords: '💡 İpucu: Aramanızı genişletmek için daha kısa kelimeler deneyin',
    
    // Toast messages
    addedToFavorites: 'favorilere eklendi!',
    removedFromFavorites: 'favorilerden çıkarıldı',
    
    // Redirect card (home mode) - no longer used but kept for compatibility
    redirectBadge: 'Sınırları Keşfedin',
    redirectTitle: 'Tam\nKatalog',
    redirectDesc: 'Bebek ve çocuk modasında en trend 100\'den fazla model sizi bekliyor.',
    redirectButton: 'Hemen İncele',
    redirectLink: '/urunler',
    redirectName: 'Tüm Ürünler',
    
    // Modal
    whatsappModal: 'WhatsApp\'tan Sor',
    colors: 'Renkler',
    sizes: 'Bedenler',
    
    // WhatsApp messages
    whatsappCard: 'Merhaba, {code} kodlu ürün hakkında bilgi almak istiyorum.',
    whatsappModalFull: 'Merhaba, {code} kodlu "{name}" ürünü hakkında bilgi almak istiyorum.',
    
    // Error
    loadError: 'Ürünler yüklenirken hata oluştu'
  },
  en: {
    // Section titles
    sectionTitleHome: 'Products',
    sectionTitleFull: 'Product Catalog',
    collectionBadge: '2026 Collection',
    sectionDescHome: '',
    sectionDescFull: 'Explore our baby and children socks',
    
    // Filters
    all: 'All',
    baby: 'Baby Socks',
    child: 'Kids Socks',
    favorites: 'Favorites',
    searchPlaceholder: 'Search by code or name... (e.g. KOD-14)',
    productsFound: 'products found',
    
    // Buttons
    gridView: 'Wide Card View',
    listView: 'Compact List View',
    askQuestion: 'Ask Question',
    getQuote: 'Get Quote',
    goToCatalog: 'Go to Catalog',
    productsCount: '+ products',
    
    // Pagination
    previous: 'Previous',
    next: 'Next',
    pageInfo: '. page - Total',
    productsWord: 'products',
    
    // Empty state
    noResults: 'No products match your search',
    noResultsDesc: 'Clear filters and try again.',
    clearFilters: 'Clear Filters',
    noFavorites: 'No favorite products yet',
    noFavoritesDesc: 'Click the heart icon to add products to favorites.',
    tryDifferentKeywords: '💡 Tip: Try shorter keywords to broaden your search',
    
    // Toast messages
    addedToFavorites: 'added to favorites!',
    removedFromFavorites: 'removed from favorites',
    
    // Redirect card (home mode) - no longer used but kept for compatibility
    redirectBadge: 'Discover More',
    redirectTitle: 'Full\nCatalog',
    redirectDesc: '100+ trendy models in baby and kids fashion waiting for you.',
    redirectButton: 'Explore Now',
    redirectLink: '/en/products',
    redirectName: 'All Products',
    
    // Modal
    whatsappModal: 'Ask on WhatsApp',
    colors: 'Colors',
    sizes: 'Sizes',
    
    // WhatsApp messages
    whatsappCard: 'Hello, I would like information about product {code}.',
    whatsappModalFull: 'Hello, I would like information about product {code} "{name}".',
    
    // Error
    loadError: 'Error loading products'
  }
};

// Ana CatalogSection Komponenti
interface CatalogSectionProps {
  mode?: 'home' | 'full';
  lang?: 'tr' | 'en';
}

export default function CatalogSection({ mode = 'home', lang = 'tr' }: CatalogSectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState(() => {
    // Clear any persisted search query on mount
    return '';
  });
  const [activeCategories, setActiveCategories] = useState<string[]>(() => {
    // Clear any persisted categories on mount
    return [];
  });
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const productsPerPage = mode === 'home' ? 4 : 10;

  // Get URL params on mount
  useEffect(() => {
    if (mode === 'full') {
      const urlParams = new URLSearchParams(window.location.search);
      const searchFromUrl = urlParams.get('search');
      const categoryFromUrl = urlParams.get('category');
      
      if (searchFromUrl) {
        setSearchQuery(searchFromUrl);
      }
      
      if (categoryFromUrl && ['bebek', 'cocuk'].includes(categoryFromUrl)) {
        setActiveCategories([categoryFromUrl]);
      }
    }
  }, [mode]);

  // Debounced arama değeri (300ms gecikme)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // JSON'dan ürünleri getir
  useEffect(() => {
    console.log('🚀 Component mounted');

    const loadProducts = async () => {
      try {
        console.log('📦 Loading products...');
        const fetchedProducts = await fetchProducts();
        console.log('📦 Products loaded:', fetchedProducts.length);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error(translations[lang].loadError);
        // Hata durumunda boş dizi ayarla
        setProducts([]);
      } finally {
        // Minimum loading süresi için
        setTimeout(() => {
          console.log('✅ Loading complete, setting isLoading to false');
          setIsLoading(false);
        }, 500);
      }
    };

    loadProducts();
  }, []);

  // Kategoriler - Dil bazlı
  const t = translations[lang];
  const categories = [
    { id: 'all', label: t.all },
    { id: 'bebek', label: t.baby },
    { id: 'cocuk', label: t.child },
    ...(mode === 'full' ? [{ id: 'favorites', label: t.favorites }] : [])
  ];

  // Sayfa yüklendiğinde localStorage'dan favorileri al
  useEffect(() => {
    const stored = localStorage.getItem('favoriteProducts');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Favoriler yüklenemedi:', e);
      }
    }
  }, []);

  // Favoriler değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('favoriteProducts', JSON.stringify(favorites));
  }, [favorites]);

  // Storage değişikliklerini dinle (tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favoriteProducts' && e.newValue) {
        try {
          setFavorites(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Storage sync error:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  
  // Kategori toggle fonksiyonu - Tekli seçim mantığı
  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      // "Tümü" seçildiğinde her şeyi temizle
      setActiveCategories([]);
    } else {
      // Tekli seçim: sadece bir kategori seçilebilir
      setActiveCategories(prev => {
        if (prev.includes(categoryId)) {
          // Kategori zaten seçili, hepsini temizle (Tümü'ne geri dön)
          return [];
        } else {
          // Yeni kategori seç, diğerlerini temizle
          return [categoryId];
        }
      });
    }
  };

  // Kategori aktif mi kontrol et
  const isCategoryActive = (categoryId: string) => {
    if (categoryId === 'all') {
      return activeCategories.length === 0;
    }
    return activeCategories.includes(categoryId);
  };

  // Filtrelenmiş ürünler
  const filteredProducts = useMemo(() => {
    // Başlangıçta products boş ise, boş dizi dönerek hata önle
    if (!products || products.length === 0) {
      return [];
    }

    let result = products;

    // Favoriler filtresi
    if (activeCategories.includes('favorites')) {
      result = result.filter(product => favorites.some(fav => fav.id === product.id));
    }
    // Normal kategori filtresi (tekli seçim)
    else if (activeCategories.length > 0) {
      result = result.filter(product => activeCategories.includes(product.category));
    }

    // Arama filtresi (debounced)
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(product =>
        product.code.toLowerCase().includes(query) ||
        product.name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, activeCategories, debouncedSearchQuery, favorites]);

  
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategories, debouncedSearchQuery]);

  // Scroll to top when page changes or component mounts (only in full mode)
  useEffect(() => {
    if (mode === 'full') {
      // Find the catalog section element
      const catalogSection = document.getElementById('urunler');
      if (catalogSection) {
        // Get the section's position from top
        const sectionTop = catalogSection.getBoundingClientRect().top + window.pageYOffset;
        // Scroll to the section with a small offset
        window.scrollTo({
          top: sectionTop - 20,
          behavior: 'smooth'
        });
      } else {
        // Fallback: scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  }, [currentPage, mode]);

  // Ana sayfada gösterilecek ürünler (ilk 4)
  const displayedProducts = useMemo(() => {
    if (mode === 'home') {
      // İlk 4 ürün her zaman gösterilir (2x2 grid)
      return filteredProducts.slice(0, 4);
    }
    // Full modda sayfalama kullanılır
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, mode, currentPage, productsPerPage]);

  // Favori toggle
  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.find(fav => fav.id === product.id);
      if (exists) {
        return prev.filter(fav => fav.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Favori mi kontrol et
  const isFavorite = (productId: number) => {
    return favorites.some(fav => fav.id === productId);
  };

  // Full mode için katalog arka planı ile component
  const FullModeWithBackground = () => (
    <div className="relative min-h-screen">
      {/* Fixed Background Image - Özel Katalog Arka Planı */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/katalogbackground.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Siyah Overlay - Kristal Netliğinde Okunabilirlik */}
      <div className="fixed inset-0 z-10 bg-black/60"></div>
      
      {/* Üst Geçiş - Beyazdan Şeffafa (Navbar'dan Katalog'a) */}
      <div className="fixed top-0 left-0 right-0 z-15 h-32 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)'
      }} />
      
      {/* Alt Geçiş - Koyudan Şeffafa (Katalog'dan Footer'a) */}
      <div className="fixed bottom-0 left-0 right-0 z-15 h-40 pointer-events-none" style={{
        background: 'linear-gradient(to top, rgba(30,41,59,0.5) 0%, rgba(30,41,59,0) 100%)'
      }} />
      
      {/* Content Section */}
      <section id="urunler" className="relative z-20 py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <CatalogContent />
        </div>
      </section>
    </div>
  );

  // Home mode için basit section
  const HomeModeSimple = () => (
    <section id="urunler" className="py-10 md:py-14 pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <CatalogContent />
      </div>
    </section>
  );

  // Ortak içerik component
  const CatalogContent = () => (
    <>
      {/* Section Header with Layout Switcher */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-4">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${
            mode === 'full' ? 'text-white' : 'text-slate-800'
          }`} style={mode === 'full' ? { textShadow: '0 2px 8px rgba(0,0,0,0.5)' } : {}}>
            {mode === 'home' ? t.sectionTitleHome : t.sectionTitleFull}
          </h2>

          {/* 2026 Koleksiyonu Badge - Only for full mode */}
          {mode === 'full' && (
            <span className="inline-block px-3 py-1 text-xs md:text-sm font-semibold rounded-full shadow-lg whitespace-nowrap transform -rotate-3 hover:rotate-0 transition-transform duration-300 bg-pink-500 text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              {t.collectionBadge}
            </span>
          )}

          {/* Layout Switcher - Only for full mode */}
          {mode === 'full' && (
            <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 p-1 shadow-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-pink-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title={t.gridView}
              >
                <HiOutlineViewGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-pink-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title={t.listView}
              >
                <HiBars3 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        {mode === 'full' && (
          <p className="text-lg max-w-2xl mx-auto text-white/90" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            {t.sectionDescFull}
          </p>
        )}
      </motion.div>

      {/* Filter Bar - Only for full mode */}
      {mode === 'full' && (
        <div className="max-w-xl mx-auto mb-8">
          {/* Arama Kutusu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7.7 0 11-14 0 7.5 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-12 pr-4 py-4 backdrop-blur-sm border rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-lg transition-all placeholder:text-slate-400 bg-white/10 border-white/30 text-white placeholder:text-white/60"
              />
              {/* Arama göstergesi */}
              {searchQuery && searchQuery !== debouncedSearchQuery && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className="animate-spin h-5 w-5 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
          </motion.div>

          {/* Filtre Butonları */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-center gap-1.5 md:gap-3 overflow-x-auto overflow-y-hidden pb-2 flex-nowrap scroll-smooth scrollbar-hide px-4 -mx-4 w-full">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex-shrink-0 px-2 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 whitespace-nowrap backdrop-blur-sm ${
                    isCategoryActive(cat.id)
                      ? 'bg-pink-500/95 text-white shadow-lg'
                      : 'bg-white/10 text-white/80 border border-white/30 hover:border-pink-300 hover:text-white shadow-md hover:shadow-lg'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Sonuç Sayısı - Only for full mode */}
      {mode === 'full' && (
        <motion.div
          className="text-center mb-6 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className={`text-sm font-medium ${
            mode === 'full' ? 'text-white/90' : 'text-slate-700'
          }`} style={mode === 'full' ? { textShadow: '0 1px 4px rgba(0,0,0,0.5)' } : {}}>
            <AnimatedCounter value={filteredProducts.length} /> {t.productsFound}
          </p>
        </motion.div>
      )}

      {/* Ürün Grid/List - Dinamik Görünüm */}
      {isLoading ? (
        <motion.div
          className={`${
            mode === 'home'
              ? 'grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 max-w-2xl mx-auto'
              : viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4'
              : 'space-y-3 max-w-4xl mx-auto'
          }`}
          style={mode === 'full' ? { textShadow: '0 1px 3px rgba(0,0,0,0.3)' } : {}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(mode === 'home' ? 4 : 6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </motion.div>
      ) : filteredProducts.length === 0 ? (
        <div key="empty" className="text-center py-16">
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            {t.noResults}
          </h3>
          <p className="text-slate-500">
            {t.noResultsDesc}
          </p>
          <button
            onClick={() => {
              setActiveCategories([]);
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            {t.clearFilters}
          </button>
        </div>
      ) : (
        <motion.div
          className={`${
            mode === 'home'
              ? 'grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 max-w-2xl mx-auto'
              : viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4'
              : 'space-y-3 max-w-4xl mx-auto'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {displayedProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              isFavorite={isFavorite(product.id)}
              viewMode={mode === 'home' ? 'grid' : viewMode}
              onToggleFavorite={toggleFavorite}
              onQuickView={setSelectedProduct}
              lang={lang}
              mode={mode}
            />
          ))}
        </motion.div>
      )}


      {/* Sayfalama (Pagination) - Only for full mode */}
      {mode === 'full' && !isLoading && filteredProducts.length > productsPerPage && (
        <motion.div
          className="flex flex-col items-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Sayfa Navigasyonu */}
          <div className="flex items-center gap-2">
            {/* Önceki Sayfa */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {t.previous}
            </button>

            {/* Sayfa Numaraları */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      pageNum === currentPage
                        ? 'bg-pink-500 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Sonraki Sayfa */}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {t.next}
            </button>
          </div>

          {/* Sayfa Bilgisi */}
          <p className={`text-sm ${
            mode === 'full' ? 'text-white/70' : 'text-slate-500'
          }`}>
            {currentPage}{t.pageInfo} {filteredProducts.length} {t.productsWord}
          </p>
        </motion.div>
      )}
    </>
  );
  
  // Toplam sayfa sayısı
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <>
      <Toaster position="top-center" />
      
      {mode === 'full' ? <FullModeWithBackground /> : <HomeModeSimple />}

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <QuickViewModal
            product={selectedProduct}
            products={mode === 'home' ? filteredProducts.slice(0, 4) : filteredProducts}
            onClose={() => setSelectedProduct(null)}
            onNavigate={setSelectedProduct}
            isFavorite={isFavorite(selectedProduct.id)}
            onToggleFavorite={toggleFavorite}
            mode={mode}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </>
  );
}
