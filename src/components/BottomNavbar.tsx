import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMagnifyingGlass, HiOutlineHeart, HiHeart, HiOutlineMapPin } from 'react-icons/hi2';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

interface BottomNavbarProps {
  onSearchClick: () => void;
  favoritesCount: number;
}

export default function BottomNavbar({ onSearchClick, favoritesCount }: BottomNavbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Instagram ve konum bilgileri
  const instagramUrl = 'https://www.instagram.com/yetiscorap/';
  const googleMapsUrl = 'https://maps.app.goo.gl/s4TyJvp8L4dCikNL8';
  const favoritesUrl = '/favoriler';
  const whatsappUrl = 'https://wa.me/905369205969?text=Merhaba%2C%20%C3%BCr%C3%BCnleriniz%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.';

  // Scroll event listener
  useEffect(() => {
    // 2 saniye sonra görünsün
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Sayfa en üstte değilse göster
      if (currentScrollY > 100) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(showTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const navItems = [
    {
      id: 'search',
      icon: HiOutlineMagnifyingGlass,
      label: 'Ara',
      onClick: () => {
        setActiveTab('search');
        onSearchClick();
      }
    },
    {
      id: 'whatsapp',
      icon: FaWhatsapp,
      label: 'WhatsApp',
      href: whatsappUrl,
      external: true
    },
    {
      id: 'instagram',
      icon: FaInstagram,
      label: 'Instagram',
      href: instagramUrl,
      external: true
    },
    {
      id: 'location',
      icon: HiOutlineMapPin,
      label: 'Konum',
      href: googleMapsUrl,
      external: true
    },
    {
      id: 'favorites',
      icon: favoritesCount > 0 ? HiHeart : HiOutlineHeart,
      label: 'Favoriler',
      href: favoritesUrl,
      badge: favoritesCount > 0 ? favoritesCount : undefined
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          className="fixed bottom-0 left-0 right-0 z-20 md:hidden"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Gradient shadow at top */}
          <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
          
          {/* Navbar container */}
          <div className="bg-white/90 backdrop-blur-lg border-t border-slate-200/50 shadow-lg">
            <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                const content = (
                  <motion.div
                    className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-colors relative ${
                      isActive ? 'text-pink-500' : 'text-slate-600'
                    }`}
                    onClick={item.onClick}
                  >
                    {/* Badge */}
                    {item.badge && (
                      <motion.span
                        className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                      >
                        {item.badge > 9 ? '9+' : item.badge}
                      </motion.span>
                    )}
                    
                    <Icon className={`w-6 h-6 ${item.id === 'favorites' && favoritesCount > 0 ? 'text-red-500' : ''} ${item.id === 'whatsapp' ? 'text-[#25D366]' : ''}`} />
                    <span className="text-[10px] font-medium mt-1">{item.label}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 w-1 h-1 bg-pink-500 rounded-full"
                        layoutId="activeIndicator"
                      />
                    )}
                  </motion.div>
                );

                if (item.href) {
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      onClick={() => setActiveTab(item.id)}
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <button key={item.id} type="button">
                    {content}
                  </button>
                );
              })}
            </div>
            
            {/* Safe area for iOS */}
            <div className="h-safe-area-inset-bottom bg-white/90" />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
