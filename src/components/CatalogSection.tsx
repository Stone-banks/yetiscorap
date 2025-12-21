import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi2';
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

// Örnek ürün verileri
const products: Product[] = [
  {
    id: 1,
    code: 'KOD-01',
    name: 'Dantelli Kız Bebek Çorabı',
    category: 'bebek',
    ageRange: '0-6 Ay',
    image: '/images/placeholder.png',
    description: 'Zarif dantel detaylı, yumuşak pamuklu bebek çorabı. Hassas bebek cildine uygun.',
    colors: ['Pembe', 'Beyaz', 'Krem'],
    sizes: ['0-3 Ay', '3-6 Ay']
  },
  {
    id: 2,
    code: 'KOD-02',
    name: 'Fırfırlı Bebek Patik',
    category: 'bebek',
    ageRange: '0-12 Ay',
    image: '/images/placeholder.png',
    description: 'Şık fırfır detaylı patik çorap. %100 pamuk.',
    colors: ['Pembe', 'Mor', 'Beyaz'],
    sizes: ['0-6 Ay', '6-12 Ay']
  },
  {
    id: 3,
    code: 'KOD-03',
    name: 'Kaymaz Tabanlı Bebek Çorabı',
    category: 'bebek',
    ageRange: '6-12 Ay',
    image: '/images/placeholder.png',
    description: 'Silikon kaymaz tabanlı, güvenli yürüyüş için tasarlandı.',
    colors: ['Mavi', 'Gri', 'Beyaz'],
    sizes: ['6-9 Ay', '9-12 Ay']
  },
  {
    id: 4,
    code: 'KOD-04',
    name: 'Organik Pamuklu Yenidoğan Seti',
    category: 'bebek',
    ageRange: '0-3 Ay',
    image: '/images/placeholder.png',
    description: '%100 organik pamuk. Yenidoğan bebekler için ideal.',
    colors: ['Beyaz', 'Krem'],
    sizes: ['Tek Beden']
  },
  {
    id: 5,
    code: 'KOD-14',
    name: 'Desenli Kız Çocuk Çorabı',
    category: 'cocuk',
    ageRange: '3-5 Yaş',
    image: '/images/placeholder.png',
    description: 'Eğlenceli desenli, rahat çocuk çorabı.',
    colors: ['Pembe', 'Mor', 'Turkuaz'],
    sizes: ['3-4 Yaş', '4-5 Yaş']
  },
  {
    id: 6,
    code: 'KOD-15',
    name: 'Spor Erkek Çocuk Çorabı',
    category: 'cocuk',
    ageRange: '4-6 Yaş',
    image: '/images/placeholder.png',
    description: 'Spor aktiviteleri için ideal, nefes alan kumaş.',
    colors: ['Lacivert', 'Siyah', 'Beyaz'],
    sizes: ['4-5 Yaş', '5-6 Yaş']
  },
  {
    id: 7,
    code: 'KOD-23',
    name: 'Okul Çorabı Seti',
    category: 'cocuk',
    ageRange: '6-10 Yaş',
    image: '/images/placeholder.png',
    description: 'Okul kullanımı için ideal, dayanıklı çorap seti.',
    colors: ['Beyaz', 'Lacivert', 'Siyah'],
    sizes: ['6-8 Yaş', '8-10 Yaş']
  },
  {
    id: 8,
    code: 'KOD-24',
    name: 'Renkli Çizgili Çocuk Çorabı',
    category: 'cocuk',
    ageRange: '5-8 Yaş',
    image: '/images/placeholder.png',
    description: 'Neşeli çizgi desenli, pamuklu çocuk çorabı.',
    colors: ['Çok Renkli'],
    sizes: ['5-6 Yaş', '6-8 Yaş']
  }
];

const whatsappNumber = '905369205969';

// Skeleton Kart Komponenti
const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden border border-slate-100 animate-pulse">
    <div className="aspect-square bg-slate-200" />
    <div className="p-2">
      <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-2 bg-slate-200 rounded w-1/2 mb-2" />
      <div className="h-8 bg-slate-200 rounded mt-2" />
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
      className="product-card group bg-white rounded-xl overflow-hidden border border-slate-100 cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView(product)}
      whileHover={{ scale: 1.02, y: -4 }}
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
        
        {/* Ürün Kodu Badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-pink-500 text-white shadow-md">
            {product.code}
          </span>
        </div>

        {/* Favori Butonu */}
        <motion.button
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md z-10"
          onClick={handleFavoriteClick}
          whileTap={{ scale: 1.3 }}
        >
          <motion.div
            animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {isFavorite ? (
              <HiHeart className="w-5 h-5 text-red-500" />
            ) : (
              <HiOutlineHeart className="w-5 h-5 text-slate-400" />
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
      <div className="p-2">
        <h3 className="font-medium text-slate-800 text-xs leading-tight mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[10px] text-slate-500 mb-2">{product.ageRange}</p>
        
        {/* Soru Sor Butonu */}
        <motion.a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Merhaba, ${product.code} kodlu ürün hakkında bilgi almak istiyorum.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-1.5 bg-green-500 text-white text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          whileHover={{ backgroundColor: '#16a34a' }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Soru Sor
        </motion.a>
      </div>
    </motion.article>
  );
};

// Quick View Modal
interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}

const QuickViewModal = ({ product, onClose, isFavorite, onToggleFavorite }: QuickViewModalProps) => {
  if (!product) return null;

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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md z-10 hover:bg-white transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(product)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md z-10 hover:bg-white transition-colors"
        >
          {isFavorite ? (
            <HiHeart className="w-5 h-5 text-red-500" />
          ) : (
            <HiOutlineHeart className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Product Image */}
        <div className="relative aspect-square bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.png';
            }}
          />
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-pink-500 text-white shadow-md">
              {product.code}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6">
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
        </div>
      </motion.div>
    </motion.div>
  );
};

// Empty State
const EmptyState = ({ isFavoritesFilter }: { isFavoritesFilter?: boolean }) => (
  <motion.div
    className="text-center py-16"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="w-24 h-24 mx-auto mb-6 text-slate-300"
      animate={{ 
        rotate: isFavoritesFilter ? 0 : [0, -10, 10, -10, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    >
      {isFavoritesFilter ? (
        <HiOutlineHeart className="w-full h-full" />
      ) : (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      )}
    </motion.div>
    <h3 className="text-xl font-semibold text-slate-700 mb-2">
      {isFavoritesFilter ? 'Henüz favori ürün yok' : 'Aramanızla eşleşen ürün bulunamadı'}
    </h3>
    <p className="text-slate-500 mb-4">
      {isFavoritesFilter 
        ? 'Beğendiğiniz ürünlerin kalp ikonuna tıklayarak favorilere ekleyebilirsiniz.'
        : 'Farklı anahtar kelimeler deneyin veya filtreleri temizleyin.'}
    </p>
    {!isFavoritesFilter && (
      <p className="text-sm text-slate-400">💡 İpucu: Aramanızı genişletmek için daha kısa kelimeler deneyin</p>
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

// Ana CatalogSection Komponenti
export default function CatalogSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Kategoriler
  const categories = [
    { id: 'all', label: 'Tümü' },
    { id: 'bebek', label: 'Bebek Çorapları' },
    { id: 'cocuk', label: 'Çocuk Çorapları' },
    { id: 'favorites', label: `❤️ Favoriler`, count: favorites.length }
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

  // Filtrelenmiş ürünler
  const filteredProducts = useMemo(() => {
    let result = products;

    // Favoriler filtresi
    if (activeCategory === 'favorites') {
      result = products.filter(product => 
        favorites.some(fav => fav.id === product.id)
      );
    } else if (activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
    }

    // Arama filtresi
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.code.toLowerCase().includes(query) ||
        product.name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeCategory, searchQuery, favorites]);

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

  // Arama inputuna focus
  const handleSearchClick = () => {
    searchInputRef.current?.focus();
    searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 px-4 md:px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                    activeCategory === cat.id
                      ? cat.id === 'favorites' 
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-pink-500 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-pink-300 hover:text-pink-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{cat.label}</span>
                  {cat.count !== undefined && cat.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeCategory === cat.id 
                        ? 'bg-white/20' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {cat.count}
                    </span>
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

          {/* Ürün Grid */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            ) : filteredProducts.length === 0 ? (
              <EmptyState key="empty" isFavoritesFilter={activeCategory === 'favorites'} />
            ) : (
              <motion.div
                key="products"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
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

          {/* Tüm Ürünleri Gör Butonu */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href="/urunler"
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800 text-white text-lg font-semibold rounded-full shadow-lg"
              whileHover={{ scale: 1.02, backgroundColor: '#1e293b' }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Tüm Ürünleri Gör</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>
        </div>

        {/* Quick View Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <QuickViewModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              isFavorite={isFavorite(selectedProduct.id)}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
