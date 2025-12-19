/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      /**
       * Yetiş Çorap Marka Renkleri
       * Neşeli ama kurumsal tasarım dili için
       */
      colors: {
        'brand-pink': '#F472B6',
        'brand-blue': '#60A5FA',
        'brand-yellow': '#FACC15',
        'brand-orange': '#FB923C',
        'whatsapp-green': '#25D366'
      },
      /**
       * Mobil öncelikli tasarım için font boyutları
       * Okunabilirlik ve erişilebilirlik için optimize edilmiş
       */
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }]
      },
      /**
       * Container ayarları
       * Maksimum genişlik ve padding
       */
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem'
        }
      },
      /**
       * Animasyonlar (performans için minimal)
       */
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  /**
   * Plugins
   * Gerekirse @tailwindcss/typography eklenebilir
   */
  plugins: []
};
