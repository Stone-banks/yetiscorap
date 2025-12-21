import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineHeart, HiHeart, HiOutlineTrash } from 'react-icons/hi2';
import toast, { Toaster } from 'react-hot-toast';
import BottomNavbar from './BottomNavbar';

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

// Tüm ürünler (CatalogSection ile aynı)
const allProducts: Product[] = [
  {
    id: 1,
    code: 'KOD-01',
    name: 'Dantelli Kız Bebek Çorabı',
    category: 'bebek',
    ageRange: '0-6 Ay',
    image: '/images/placeholder.png',
    description: 'Zarif dantel detaylı, yumuşak pamuklu bebek çorabı.',
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
    description: 'Şık fırfır detaylı patik çorap.',
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
    description: 'Silikon kaymaz tabanlı, güvenli yürüyüş için.',
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
    description: '%100 organik pamuk.',
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
    description: 'Eğlenceli desenli çocuk çorabı.',
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
    description: 'Spor aktiviteleri için ideal.',
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
    description: 'Okul kullanımı için ideal.',
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
    description: 'Neşeli çizgi desenli çorap.',
    colors: ['Çok Renkli'],
    sizes: ['5-6 Yaş', '6-8 Yaş']
  }
];

const whatsappNumber = '905369205969';

// Skeleton Kart
const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden border border-slate-100 animate-pulse">
    <div className="aspect-square bg-slate-200" />
    <div className="p-3">
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-1/2 mb-3" />
      <div className="h-10 bg-slate-200 rounded mt-2" />
    </div>
  </div>
);

// Empty State
const EmptyState = () => (
  <motion.div
    className="text-center py-16"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <motion.div
      className="w-32 h-32 mx-auto mb-6 text-slate-200"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </motion.div>
    <h3 className="text-2xl font-bold text-slate-700 mb-3">Henüz favori ürün yok</h3>
    <p className="text-slate-500 mb-6 max-w-md mx-auto">
      Beğendiğiniz ürünlerin kalp ikonuna tıklayarak favorilere ekleyebilirsiniz.
    </p>
    <motion.a
      href="/#urunler"
      className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      Ürünleri Keşfet
    </motion.a>
  </motion.div>
);

// Ürün Kartı
interface FavoriteCardProps {
  product: Product;
  index: number;
  onRemove: (product: Product) => void;
}

const FavoriteCard = ({ product, index, onRemove }: FavoriteCardProps) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(product);
    toast.success(`${product.name} favorilerden çıkarıldı`, {
      icon: '💔',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all"
    >
      {/* Ürün Görseli */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
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

        {/* Kaldır Butonu */}
        <motion.button
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleRemove}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <HiOutlineTrash className="w-4 h-4 text-red-500" />
        </motion.button>

        {/* Favori ikonu */}
        <div className="absolute bottom-2 right-2">
          <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
            <HiHeart className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </div>
      
      {/* Ürün Bilgileri */}
      <div className="p-3">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 mb-3">{product.ageRange}</p>
        
        {/* Soru Sor Butonu */}
        <motion.a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Merhaba, ${product.code} kodlu ürün hakkında bilgi almak istiyorum.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 bg-green-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
          whileHover={{ backgroundColor: '#16a34a' }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Soru Sor
        </motion.a>
      </div>
    </motion.article>
  );
};

// Ana Favoriler Sayfası
export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // LocalStorage'dan favorileri al
  useEffect(() => {
    const loadFavorites = () => {
      const stored = localStorage.getItem('favoriteProducts');
      if (stored) {
        try {
          const favoriteIds = JSON.parse(stored) as Product[];
          // ID'lere göre ürünleri bul
          const favoriteProducts = favoriteIds.map(fav => 
            allProducts.find(p => p.id === fav.id) || fav
          );
          setFavorites(favoriteProducts);
        } catch (e) {
          console.error('Favoriler yüklenemedi:', e);
        }
      }
      setIsLoading(false);
    };

    // Küçük bir gecikme ile yükle (UX için)
    setTimeout(loadFavorites, 500);
  }, []);

  // Storage değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favoriteProducts' && e.newValue) {
        try {
          const favoriteIds = JSON.parse(e.newValue) as Product[];
          const favoriteProducts = favoriteIds.map(fav => 
            allProducts.find(p => p.id === fav.id) || fav
          );
          setFavorites(favoriteProducts);
        } catch (err) {
          console.error('Storage sync error:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Favori kaldır
  const removeFavorite = (product: Product) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(fav => fav.id !== product.id);
      localStorage.setItem('favoriteProducts', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Tüm favorileri temizle
  const clearAllFavorites = () => {
    if (window.confirm('Tüm favorileri silmek istediğinize emin misiniz?')) {
      setFavorites([]);
      localStorage.setItem('favoriteProducts', JSON.stringify([]));
      toast.success('Tüm favoriler temizlendi', {
        icon: '🗑️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  // Arama filtresi
  const filteredFavorites = useMemo(() => {
    if (!searchQuery) return favorites;
    const query = searchQuery.toLowerCase();
    return favorites.filter(product =>
      product.code.toLowerCase().includes(query) ||
      product.name.toLowerCase().includes(query)
    );
  }, [favorites, searchQuery]);

  // Arama click handler
  const handleSearchClick = () => {
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      
      <div className="pb-24 md:pb-0">
        {/* Arama ve İstatistik */}
        {favorites.length > 0 && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Arama */}
            <div className="max-w-md mx-auto mb-4">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Favorilerde ara..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>

            {/* İstatistik ve Temizle */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-pink-500">{filteredFavorites.length}</span>
                {' '}favori ürün
              </p>
              <button
                onClick={clearAllFavorites}
                className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Tümünü Temizle
              </button>
            </div>
          </motion.div>
        )}

        {/* İçerik */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : filteredFavorites.length === 0 ? (
            <EmptyState key="empty" />
          ) : (
            <motion.div
              key="favorites"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence>
                {filteredFavorites.map((product, index) => (
                  <FavoriteCard
                    key={product.id}
                    product={product}
                    index={index}
                    onRemove={removeFavorite}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <BottomNavbar 
        onSearchClick={handleSearchClick}
        favoritesCount={favorites.length}
      />
    </>
  );
}
