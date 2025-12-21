import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPhone,
  HiHeart,
  HiOutlineHeart,
  HiMagnifyingGlass,
  HiXMark,
  HiBars3
} from 'react-icons/hi2';
import { SiInstagram } from 'react-icons/si';
import { FaWhatsapp } from 'react-icons/fa';

// ==================== TYPES ====================
interface HeaderNavProps {
  lang?: 'tr' | 'en';
  currentPath?: string;
}

interface MenuItem {
  label: string;
  href: string;
}

interface NavIconItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
  color: string;
  hoverColor: string;
  external?: boolean;
  badge?: number;
  tooltip?: string;
}

// ==================== CUSTOM HOOKS ====================
const useScrolled = (threshold: number = 80) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
};

const useFavoritesCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem('favoriteProducts');
        if (stored) {
          const favorites = JSON.parse(stored);
          setCount(Array.isArray(favorites) ? favorites.length : 0);
        }
      } catch {
        setCount(0);
      }
    };

    updateCount();
    
    // Listen for storage changes (cross-tab sync)
    window.addEventListener('storage', updateCount);
    
    // Custom event for same-tab updates
    window.addEventListener('favoritesUpdated', updateCount);
    
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('favoritesUpdated', updateCount);
    };
  }, []);

  return count;
};

// ==================== TOOLTIP COMPONENT ====================
const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg whitespace-nowrap z-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
          >
            {text}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== INSTAGRAM GRADIENT ICON ====================
const InstagramIcon = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <SiInstagram className="w-full h-full" style={{
      background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }} />
  </div>
);

// ==================== GOOGLE MAPS ICON ====================
const GoogleMapsIcon = ({ className }: { className?: string }) => (
  <img
    src="/mapspin.svg"
    alt="Google Maps"
    className={className}
  />
);

// ==================== SEARCH DRAWER ====================
const SearchDrawer = ({ 
  isOpen, 
  onClose,
  lang 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  lang: 'tr' | 'en';
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      window.location.href = lang === 'tr' 
        ? `/urunler?search=${encodeURIComponent(searchQuery)}`
        : `/en/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Search Panel */}
          <motion.div
            className="fixed top-0 left-0 right-0 bg-white z-[101] shadow-2xl"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative">
                  <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'tr' ? 'Ürün kodu veya isim ara...' : 'Search product code or name...'}
                    className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    autoFocus
                  />
                </form>
                <button
                  onClick={onClose}
                  className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <HiXMark className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== MOBILE DRAWER MENU ====================
const MobileDrawer = ({
  isOpen,
  onClose,
  menuItems,
  currentPath,
  lang
}: {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  currentPath: string;
  lang: 'tr' | 'en';
}) => {
  const whatsappMsg = lang === 'tr'
    ? encodeURIComponent('Merhaba, ürünleriniz hakkında bilgi almak istiyorum.')
    : encodeURIComponent('Hello, I would like to get information about your products.');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const isActive = (href: string) => {
    if (href === '/' || href === '/en') {
      return currentPath === href;
    }
    return currentPath.startsWith(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Drawer Panel */}
          <motion.aside
            className="fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-white z-[70] shadow-2xl md:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <img
                  src="/yetiscoraplogo.png"
                  alt="Yetiş Çorap"
                  className="h-10 w-auto object-contain"
                />
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <HiXMark className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                          isActive(item.href)
                            ? 'text-pink-600 bg-pink-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={onClose}
                      >
                        {isActive(item.href) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                        )}
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Search */}
                <div className="mt-6 px-4">
                  <a
                    href={lang === 'tr' ? '/urunler' : '/en/products'}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <HiMagnifyingGlass className="w-5 h-5" />
                    <span>{lang === 'tr' ? 'Ürün Ara' : 'Search Products'}</span>
                  </a>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 px-4 space-y-3">
                  <a
                    href={`https://wa.me/905369205969?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
                    onClick={onClose}
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    <span>{lang === 'tr' ? 'WhatsApp ile İletişim' : 'Contact via WhatsApp'}</span>
                  </a>

                  <a
                    href="tel:+905369205969"
                    className="flex items-center justify-center gap-3 w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                    onClick={onClose}
                  >
                    <HiPhone className="w-5 h-5" />
                    <span>{lang === 'tr' ? 'Hemen Ara' : 'Call Now'}</span>
                  </a>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  {lang === 'tr' ? 'Dil Seçimi' : 'Language'}
                </p>
                <div className="flex gap-2">
                  <a
                    href="/"
                    className={`flex-1 py-2 text-center rounded-lg text-sm font-medium transition-colors ${
                      lang === 'tr' ? 'bg-pink-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Türkçe
                  </a>
                  <a
                    href="/en"
                    className={`flex-1 py-2 text-center rounded-lg text-sm font-medium transition-colors ${
                      lang === 'en' ? 'bg-pink-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    English
                  </a>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== MAIN HEADER COMPONENT ====================
export default function HeaderNav({ lang = 'tr', currentPath = '' }: HeaderNavProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isScrolled = useScrolled(80);
  const favoritesCount = useFavoritesCount();

  // Menu items based on language
  const menuItems: MenuItem[] = lang === 'tr'
    ? [
        { label: 'Ana Sayfa', href: '/' },
        { label: 'Ürünler', href: '/urunler' },
        { label: 'İletişim', href: '/iletisim' }
      ]
    : [
        { label: 'Home', href: '/en' },
        { label: 'Products', href: '/en/products' },
        { label: 'Contact', href: '/en/contact' }
      ];

  // URLs
  const phoneUrl = 'tel:+905369205969';
  const instagramUrl = 'https://www.instagram.com/yetiscorap/';
  const googleMapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=41.043889,28.88469';
  const favoritesUrl = lang === 'tr' ? '/favoriler' : '/en/favorites';
  const whatsappMsg = lang === 'tr'
    ? encodeURIComponent('Merhaba, ürünleriniz hakkında bilgi almak istiyorum.')
    : encodeURIComponent('Hello, I would like to get information about your products.');
  const whatsappUrl = `https://wa.me/905369205969?text=${whatsappMsg}`;

  // Desktop icon items
  const desktopIconItems: NavIconItem[] = [
    {
      id: 'search',
      icon: HiMagnifyingGlass,
      label: lang === 'tr' ? 'Ara' : 'Search',
      onClick: () => setIsSearchOpen(true),
      color: 'text-gray-700',
      hoverColor: 'hover:text-pink-500',
      tooltip: lang === 'tr' ? 'Ürün Ara' : 'Search Products'
    },
    {
      id: 'phone',
      icon: HiPhone,
      label: lang === 'tr' ? 'Telefon' : 'Phone',
      href: phoneUrl,
      color: 'text-emerald-500',
      hoverColor: 'hover:text-emerald-600',
      tooltip: lang === 'tr' ? 'Bizi Arayın' : 'Call Us'
    },
    {
      id: 'instagram',
      icon: SiInstagram,
      label: 'Instagram',
      href: instagramUrl,
      external: true,
      color: 'text-pink-500',
      hoverColor: 'hover:text-pink-600',
      tooltip: lang === 'tr' ? 'Instagram\'da Takip Edin' : 'Follow on Instagram'
    },
    {
      id: 'location',
      icon: GoogleMapsIcon,
      label: lang === 'tr' ? 'Konum' : 'Location',
      href: googleMapsUrl,
      external: true,
      color: 'text-red-500',
      hoverColor: 'hover:text-red-600',
      tooltip: lang === 'tr' ? 'Konumumuzu Görüntüle' : 'View Our Location'
    },
    {
      id: 'favorites',
      icon: favoritesCount > 0 ? HiHeart : HiOutlineHeart,
      label: lang === 'tr' ? 'Favoriler' : 'Favorites',
      href: favoritesUrl,
      color: 'text-pink-500',
      hoverColor: 'hover:text-pink-600',
      tooltip: lang === 'tr' ? 'Favoriler' : 'Favorites'
    }
  ];

  // Mobile bottom nav items - Yeni sıralama: Ara (Telefon) - WhatsApp - Instagram - Konum - Favoriler
  const mobileNavItems: NavIconItem[] = [
    {
      id: 'phone',
      icon: HiPhone,
      label: lang === 'tr' ? 'Ara' : 'Call',
      href: phoneUrl,
      color: 'text-emerald-500',
      hoverColor: 'hover:text-emerald-600'
    },
    {
      id: 'whatsapp',
      icon: FaWhatsapp,
      label: 'WhatsApp',
      href: whatsappUrl,
      external: true,
      color: 'text-[#25D366]',
      hoverColor: 'hover:text-[#128C7E]'
    },
    {
      id: 'instagram',
      icon: SiInstagram,
      label: 'Instagram',
      href: instagramUrl,
      external: true,
      color: 'text-pink-500',
      hoverColor: 'hover:text-pink-600'
    },
    {
      id: 'location',
      icon: GoogleMapsIcon,
      label: lang === 'tr' ? 'Konum' : 'Location',
      href: googleMapsUrl,
      external: true,
      color: 'text-red-500',
      hoverColor: 'hover:text-red-600'
    },
    {
      id: 'favorites',
      icon: favoritesCount > 0 ? HiHeart : HiOutlineHeart,
      label: lang === 'tr' ? 'Favoriler' : 'Favorites',
      href: favoritesUrl,
      color: 'text-pink-500',
      hoverColor: 'hover:text-pink-600'
    }
  ];

  const isActive = useCallback((href: string) => {
    const path = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '');
    if (href === '/' || href === '/en') {
      return path === href;
    }
    return path.startsWith(href);
  }, [currentPath]);

  return (
    <>
      {/* ==================== DESKTOP HEADER ==================== */}
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-md py-2' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href={lang === 'tr' ? '/' : '/en'} 
              className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
            >
              <img
                src="/yetiscoraplogo.png"
                alt="Yetiş Çorap"
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? 'h-10' : 'h-12'
                }`}
              />
            </a>

            {/* Menu Items */}
            <ul className="flex items-center gap-1">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`relative px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-pink-600 bg-pink-50'
                        : 'text-gray-700 hover:text-pink-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full"
                        layoutId="activeMenuIndicator"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            {/* Icon Group */}
            <div className="flex items-center gap-4">
              {desktopIconItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <motion.div
                    className={`relative p-2 rounded-full transition-colors duration-200 ${item.color} ${item.hoverColor}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Special gradient for Instagram */}
                    {item.id === 'instagram' ? (
                      <div className="w-5 h-5">
                        <SiInstagram 
                          className="w-full h-full"
                          style={{
                            fill: 'url(#instagram-gradient)'
                          }}
                        />
                        <svg width="0" height="0">
                          <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f09433" />
                            <stop offset="25%" stopColor="#e6683c" />
                            <stop offset="50%" stopColor="#dc2743" />
                            <stop offset="75%" stopColor="#cc2366" />
                            <stop offset="100%" stopColor="#bc1888" />
                          </linearGradient>
                        </svg>
                      </div>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                    
                    {/* Badge removed - only showing heart icon */}
                  </motion.div>
                );

                if (item.tooltip) {
                  if (item.href) {
                    return (
                      <Tooltip key={item.id} text={item.tooltip}>
                        <a
                          href={item.href}
                          target={item.external ? '_blank' : undefined}
                          rel={item.external ? 'noopener noreferrer' : undefined}
                        >
                          {content}
                        </a>
                      </Tooltip>
                    );
                  }
                  return (
                    <Tooltip key={item.id} text={item.tooltip}>
                      <button type="button" onClick={item.onClick}>
                        {content}
                      </button>
                    </Tooltip>
                  );
                }

                if (item.href) {
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <button key={item.id} type="button" onClick={item.onClick}>
                    {content}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* ==================== MOBILE TOP HEADER ==================== */}
      <header
        className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-md' 
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <nav className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <a href={lang === 'tr' ? '/' : '/en'} className="flex-shrink-0">
            <img
              src="/yetiscoraplogo.png"
              alt="Yetiş Çorap"
              className="h-9 w-auto object-contain"
            />
          </a>

          {/* Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={lang === 'tr' ? 'Menüyü aç' : 'Open menu'}
          >
            <HiBars3 className="w-6 h-6 text-gray-700" />
          </button>
        </nav>
      </header>

      {/* ==================== MOBILE BOTTOM NAVBAR ==================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Gradient shadow */}
        <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
        
        {/* Navbar container */}
        <div
          className="h-16 flex items-center justify-around px-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 -4px 20px -5px rgba(0, 0, 0, 0.1)'
          }}
        >
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            
            if (item.href) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="relative flex flex-col items-center justify-center py-1"
                >
                  <motion.div
                    className={`relative ${item.color}`}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {/* Special styling for WhatsApp */}
                    {item.id === 'whatsapp' ? (
                      <div className="w-6 h-6 relative">
                        <FaWhatsapp className="w-full h-full" />
                        {/* Pulse animation for WhatsApp */}
                        <span className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                      </div>
                    ) : /* Special gradient for Instagram */ item.id === 'instagram' ? (
                      <div className="w-6 h-6">
                        <SiInstagram
                          className="w-full h-full"
                          style={{
                            fill: 'url(#instagram-gradient-mobile)'
                          }}
                        />
                        <svg width="0" height="0">
                          <linearGradient id="instagram-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f09433" />
                            <stop offset="25%" stopColor="#e6683c" />
                            <stop offset="50%" stopColor="#dc2743" />
                            <stop offset="75%" stopColor="#cc2366" />
                            <stop offset="100%" stopColor="#bc1888" />
                          </linearGradient>
                        </svg>
                      </div>
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </motion.div>
                  <span className="text-[10px] font-medium text-gray-600 mt-1">{item.label}</span>
                </a>
              );
            }
            
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className="relative flex flex-col items-center justify-center py-1"
              >
                <motion.div
                  className={`relative ${item.color}`}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                <span className="text-[10px] font-medium text-gray-600 mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* Safe area for iOS */}
        <div 
          className="bg-white/95"
          style={{ 
            height: 'env(safe-area-inset-bottom, 0px)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }} 
        />
      </nav>

      {/* ==================== SEARCH DRAWER ==================== */}
      <SearchDrawer 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        lang={lang}
      />

      {/* ==================== MOBILE DRAWER MENU ==================== */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        menuItems={menuItems}
        currentPath={currentPath}
        lang={lang}
      />

      {/* Spacer for fixed headers */}
      <div className="h-14 md:h-20" />
    </>
  );
}
