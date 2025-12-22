import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPhone,
  HiHeart,
  HiOutlineHeart,
  HiMagnifyingGlass,
  HiXMark,
  HiBars3,
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineEnvelope
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

  // Menu item icons
  const getMenuIcon = (href: string) => {
    if (href === '/' || href === '/en') {
      return <HiOutlineHome className="w-5 h-5" />;
    }
    if (href.includes('urunler') || href.includes('products')) {
      return <HiOutlineSquares2X2 className="w-5 h-5" />;
    }
    if (href.includes('iletisim') || href.includes('contact')) {
      return <HiOutlineEnvelope className="w-5 h-5" />;
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel - %75 genişlik, sağdan gölge */}
          <motion.aside
            className="fixed top-0 right-0 bottom-0 w-[75vw] max-w-[320px] bg-white z-[70] md:hidden"
            style={{
              boxShadow: '-8px 0 30px -5px rgba(0, 0, 0, 0.15)'
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Menü</span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <HiXMark className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Navigation - Minimalist */}
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                          isActive(item.href)
                            ? 'text-pink-600 bg-pink-50'
                            : 'text-gray-700 hover:text-pink-600 hover:bg-gray-50'
                        }`}
                        onClick={onClose}
                      >
                        <span className={`${isActive(item.href) ? 'text-pink-500' : 'text-gray-400'}`}>
                          {getMenuIcon(item.href)}
                        </span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 text-center">
                  © 2026 Yetiş Çorap
                </p>
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
  const googleMapsUrl = 'https://maps.app.goo.gl/btf6xuFSQuvyBW117';
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
            : 'bg-white py-4'
        }`}
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,182,193,0.05) 35px, rgba(255,182,193,0.05) 70px),
                           repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,218,185,0.05) 35px, rgba(255,218,185,0.05) 70px),
                           repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(221,160,221,0.05) 35px, rgba(221,160,221,0.05) 70px)`
        }}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <a
              href={lang === 'tr' ? '/' : '/en'}
              className="flex-shrink-0 transition-transform duration-200 hover:scale-105 flex items-center gap-2"
            >
              <div className="relative">
                {/* Pastel Aura */}
                <div
                  className={`absolute -inset-4 rounded-full opacity-60 blur-lg transition-all duration-300 ${
                    isScrolled ? 'scale-75' : 'scale-100'
                  }`}
                  style={{
                    background: 'radial-gradient(circle, rgba(253,242,248,0.5) 0%, rgba(240,253,244,0.3) 50%, transparent 70%)'
                  }}
                />
                <img
                  src="/yetiscoraplogo.png"
                  alt="Yetiş Çorap"
                  className="relative object-contain transition-all duration-300"
                  style={{ width: '72px', height: 'auto', imageRendering: 'auto' }}
                />
              </div>
              {/* Mini Slogan */}
              <span className="hidden lg:inline-block text-xs text-gray-400 font-light tracking-wide">
                Bebek & Çocuk Çorapları | Toptan
              </span>
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
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,182,193,0.05) 20px, rgba(255,182,193,0.05) 40px),
                           repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(255,218,185,0.05) 20px, rgba(255,218,185,0.05) 40px)`
        }}
      >
        <nav className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <a href={lang === 'tr' ? '/' : '/en'} className="flex-shrink-0">
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-full opacity-50 blur-md"
                style={{
                  background: 'radial-gradient(circle, rgba(253,242,248,0.5) 0%, rgba(240,253,244,0.3) 50%, transparent 70%)'
                }}
              />
              <img
                src="/yetiscoraplogo.png"
                alt="Yetiş Çorap"
                className="relative object-contain"
                style={{ width: '72px', height: 'auto', imageRendering: 'auto' }}
              />
            </div>
          </a>

          {/* Sağ taraf: İletişim + Dil Seçimi + Hamburger */}
          <div className="flex items-center gap-3">
            {/* İletişim Butonu */}
            <a
              href={lang === 'tr' ? '/iletisim' : '/en/contact'}
              className="px-3 py-1.5 text-[11px] font-medium text-pink-500 border border-pink-400 rounded-full hover:bg-pink-500 hover:text-white transition-all duration-200"
            >
              {lang === 'tr' ? 'İletişim' : 'Contact'}
            </a>

            {/* Dil Seçimi - Bayrak İkonları */}
            <div className="flex items-center gap-1">
              <a
                href="/"
                className={`w-8 h-6 overflow-hidden border transition-all ${
                  lang === 'tr'
                    ? 'border-pink-500 shadow-sm'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                title="Türkçe"
              >
                {/* Türk Bayrağı */}
                <svg viewBox="0 0 32 24" className="w-full h-full">
                  <rect width="32" height="24" fill="#E30A17"/>
                  <circle cx="13" cy="12" r="4.5" fill="white"/>
                  <circle cx="14.5" cy="12" r="3.6" fill="#E30A17"/>
                  <polygon points="19,12 16.5,13.5 17,11.5 15,10 18,10" fill="white"/>
                </svg>
              </a>
              <a
                href="/en"
                className={`w-8 h-6 overflow-hidden border transition-all ${
                  lang === 'en'
                    ? 'border-pink-500 shadow-sm'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                title="English"
              >
                {/* İngiliz Bayrağı */}
                <svg viewBox="0 0 32 24" className="w-full h-full">
                  <rect width="32" height="24" fill="#012169"/>
                  <path d="M0,0 L32,24 M32,0 L0,24" stroke="white" strokeWidth="4"/>
                  <path d="M0,0 L32,24 M32,0 L0,24" stroke="#C8102E" strokeWidth="2.5"/>
                  <path d="M16,0 V24 M0,12 H32" stroke="white" strokeWidth="6"/>
                  <path d="M16,0 V24 M0,12 H32" stroke="#C8102E" strokeWidth="4"/>
                </svg>
              </a>
            </div>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={lang === 'tr' ? 'Menüyü aç' : 'Open menu'}
            >
              <HiBars3 className="w-6 h-6 text-gray-700" />
            </button>
          </div>
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
                    {item.id === 'instagram' ? (
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
