// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

/**
 * Astro Konfigürasyonu - Yetiş Çorap
 * - Statik site oluşturma (SSG)
 * - i18n desteği: TR (varsayılan, prefix yok), EN (/en)
 * - Tailwind CSS v3 entegrasyonu
 * - React entegrasyonu (Framer Motion için)
 */
export default defineConfig({
  // Statik çıktı (Node.js runtime yok)
  output: 'static',

  // Site URL (production için güncellenecek)
  site: 'https://yetiscorap.com',

  // i18n Konfigürasyonu
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en'],
    routing: {
      // TR sayfalar prefix almayacak (kök URL'de açılacak)
      // EN sayfalar /en prefix alacak
      prefixDefaultLocale: false
    }
  },

  // Entegrasyonlar
  integrations: [
    tailwind({
      // Base stilleri global.css'den gelecek
      applyBaseStyles: false
    }),
    react()
  ],

  // Performans optimizasyonları
  vite: {
    build: {
      // CSS minifikasyonu
      cssMinify: true
    }
  }
});
