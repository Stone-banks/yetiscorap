import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Favori ürün tipi
export interface FavoriteProduct {
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

// Context tipi
interface FavoritesContextType {
  favorites: FavoriteProduct[];
  toggleFavorite: (product: FavoriteProduct) => void;
  addFavorite: (product: FavoriteProduct) => void;
  removeFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
  favoritesCount: number;
}

// Context oluştur
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// LocalStorage key
const STORAGE_KEY = 'favoriteProducts';

// Provider component
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(() => {
    // Client tarafında localStorage'dan oku
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // favorites değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      // Diğer tabları senkronize etmek için custom event
      window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: favorites }));
    }
  }, [favorites]);

  // Diğer tab'lardan gelen değişiklikleri dinle
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setFavorites(JSON.parse(e.newValue));
      }
    };

    const handleCustomEvent = (e: CustomEvent<FavoriteProduct[]>) => {
      // Kendi dispatch'imizi dinlememek için
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Favori toggle
  const toggleFavorite = (product: FavoriteProduct) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === product.id);
      if (exists) {
        return prev.filter(fav => fav.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Favori ekle
  const addFavorite = (product: FavoriteProduct) => {
    setFavorites(prev => {
      if (prev.find(fav => fav.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  // Favori çıkar
  const removeFavorite = (productId: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== productId));
  };

  // Favori mi kontrol et
  const isFavorite = (productId: number) => {
    return favorites.some(fav => fav.id === productId);
  };

  // Tüm favorileri temizle
  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
        favoritesCount: favorites.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Custom hook
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

// Standalone hook (Provider olmadan kullanılabilir)
export function useFavoritesStandalone() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites]);

  // Storage değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setFavorites(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleFavorite = (product: FavoriteProduct) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === product.id);
      if (exists) {
        return prev.filter(fav => fav.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isFavorite = (productId: number) => favorites.some(fav => fav.id === productId);

  return { favorites, toggleFavorite, isFavorite, favoritesCount: favorites.length };
}
