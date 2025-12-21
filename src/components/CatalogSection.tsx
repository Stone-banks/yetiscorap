import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { HiOutlineHeart, HiHeart, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
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
  <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden border border-slate-100 animate-pulse">
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
  onToggleFavorite: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

const ProductCard = ({ product, index, isFavorite, onToggleFavorite, onQuickView }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isFavorite) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 700);
      toast.success(`${product.name} favorilere eklendi!`, {
        icon: '❤️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } else {
      toast.success(`${product.name} favorilerden çıkarıldı`, {
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
      className="product-card group bg-white rounded-lg sm:rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg cursor-pointer relative transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView(product)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Ürün Görseli */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder.png';
          }}
        />

        {/* Ürün Kodu Badge - Daha minimal */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
          <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-full text-[10px] sm:text-xs font-bold bg-pink-500/90 text-white backdrop-blur-sm">
            {product.code}
          </span>
        </div>

        {/* Favori Butonu - Daha minimal */}
        <motion.button
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm z-10"
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

      {/* Ürün Bilgileri - Mobil için optimize */}
      <div className="p-2 sm:p-3">
        <h3 className="font-semibold text-slate-800 text-xs sm:text-sm leading-tight mb-0.5 sm:mb-1 line-clamp-1 sm:line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-slate-500 mb-2 sm:mb-3">{product.ageRange}</p>

        {/* Soru Sor Butonu - Mobil için kompakt */}
        <motion.a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Merhaba, ${product.code} kodlu ürün hakkında bilgi almak istiyorum.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 sm:py-2.5 bg-green-500 text-white text-[10px] sm:text-xs font-semibold rounded-md sm:rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          whileHover={{ backgroundColor: '#16a34a' }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="hidden sm:inline">Soru Sor</span>
          <span className="sm:hidden">Sor</span>
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
}

const QuickViewModal = ({ product, products, onClose, onNavigate, isFavorite, onToggleFavorite }: QuickViewModalProps) => {
  const [direction, setDirection] = useState(0);
  const [imageKey, setImageKey] = useState(0);

  if (!product) return null;

  // Mevcut ürünün index'ini bul
  const currentIndex = products.findIndex(p => p.id === product.id);

  // Önceki ürüne git (infinite loop)
  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(-1);
    const prevIndex = currentIndex <= 0 ? products.length - 1 : currentIndex - 1;
    setImageKey(prev => prev + 1);
    onNavigate(products[prevIndex]);
  };

  // Sonraki ürüne git (infinite loop)
  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(1);
    const nextIndex = currentIndex >= products.length - 1 ? 0 : currentIndex + 1;
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
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-20 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <HiChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700" />
              </motion.button>

              {/* Next Button */}
              <motion.button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-20 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
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
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Renkler</h4>
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
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Bedenler</h4>
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
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Merhaba, ${product.code} kodlu "${product.name}" ürünü hakkında bilgi almak istiyorum.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-green-500 text-white font-semibold rounded-xl flex items-center justify-center gap-3"
            whileHover={{ backgroundColor: '#16a34a' }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp'tan Sor
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Empty State
const EmptyState = () => (
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
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    </motion.div>
    <h3 className="text-xl font-semibold text-slate-700 mb-2">
      Aramanızla eşleşen ürün bulunamadı
    </h3>
    <p className="text-slate-500 mb-4">
      Farklı anahtar kelimeler deneyin veya filtreleri temizleyin.
    </p>
    <p className="text-sm text-slate-400">💡 İpucu: Aramanızı genişletmek için daha kısa kelimeler deneyin</p>
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

// Ana CatalogSection Komponenti
export default function CatalogSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced arama değeri (300ms gecikme)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // JSON'dan ürünleri getir
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Ürünler yüklenirken hata oluştu');
      } finally {
        // Minimum loading süresi için
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    loadProducts();
  }, []);

  // Kategoriler
  const categories = [
    { id: 'all', label: 'Tümü' },
    { id: 'bebek', label: 'Bebek Çorapları' },
    { id: 'cocuk', label: 'Çocuk Çorapları' }
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

  // Fake loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Kategori toggle fonksiyonu
  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      // "Tümü" seçildiğinde diğerlerini temizle
      setActiveCategories([]);
    } else {
      setActiveCategories(prev => {
        if (prev.includes(categoryId)) {
          // Kategori zaten seçili, kaldır
          return prev.filter(id => id !== categoryId);
        } else {
          // Kategori ekle
          return [...prev, categoryId];
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
    let result = products;

    // Kategori filtresi (çoklu seçim)
    if (activeCategories.length > 0) {
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
  }, [products, activeCategories, debouncedSearchQuery]);

  // Ana sayfada gösterilecek ürünler (ilk 6)
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, 6);
  }, [filteredProducts]);

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

  return (
    <>
      <Toaster position="top-center" />
      
      <section id="urunler" className="py-16 md:py-24 bg-gray-50 pb-24 md:pb-24">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
              Ürün Kataloğu
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Bebek ve çocuk çoraplarımızı inceleyin
            </p>
          </motion.div>

          {/* Arama Kutusu */}
          <motion.div 
            className="max-w-xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün kodu veya isim ara... (örn: KOD-14)"
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm transition-all placeholder:text-slate-400"
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
            className="mb-8 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-center gap-2 md:gap-3 overflow-x-auto pb-2 px-4 -mx-4 scrollbar-hide">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex-shrink-0 px-4 md:px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                    isCategoryActive(cat.id)
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-pink-300 hover:text-pink-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{cat.label}</span>
                  {/* Seçili ise checkmark göster */}
                  {isCategoryActive(cat.id) && cat.id !== 'all' && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Sonuç Sayısı */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-slate-500 text-sm font-medium">
              <AnimatedCounter value={filteredProducts.length} /> ürün bulundu
            </p>
          </motion.div>

          {/* Ürün Grid - Mobilde 2, Tablette 3, Masaüstünde 4 kolon */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            ) : displayedProducts.length === 0 ? (
              <EmptyState key="empty" />
            ) : (
              <motion.div
                key="products"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnimatePresence>
                  {displayedProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      isFavorite={isFavorite(product.id)}
                      onToggleFavorite={toggleFavorite}
                      onQuickView={setSelectedProduct}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tüm Kataloğu İncele Butonu */}
          {filteredProducts.length > 6 && (
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.a
                href="/urunler"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-pink-500 text-lg font-semibold rounded-full border-2 border-pink-500 shadow-md hover:bg-pink-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Tüm Kataloğu İncele</span>
                <span className="text-sm text-pink-400">({filteredProducts.length} ürün)</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </motion.div>
          )}
        </div>

        {/* Quick View Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <QuickViewModal
              product={selectedProduct}
              products={filteredProducts}
              onClose={() => setSelectedProduct(null)}
              onNavigate={setSelectedProduct}
              isFavorite={isFavorite(selectedProduct.id)}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
