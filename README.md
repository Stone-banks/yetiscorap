# Yetiş Çorap - Toptan Bebek ve Çocuk Çorabı Web Sitesi

Modern, performanslı ve SEO optimize edilmiş statik web sitesi. İstanbul Giyimkent'te faaliyet gösteren Yetiş Çorap için Astro v5 ile geliştirilmiştir.

## 🎯 Özellikler

- ✅ **%100 Statik Site (SSG)** - Node.js runtime gerektirmez
- ✅ **i18n Desteği** - TR (varsayılan) ve EN dil seçenekleri
- ✅ **Mobil Öncelikli Tasarım** - Responsive ve touch-friendly
- ✅ **SEO Optimizasyonu** - JSON-LD, hreflang, meta tags
- ✅ **Lighthouse Skoru Hedefi** - Performance ≥95, SEO ≥95, Accessibility ≥90
- ✅ **WhatsApp Entegrasyonu** - CTA butonları ve sabit FAB
- ✅ **Content Collections** - Markdown tabanlı ürün yönetimi
- ✅ **Client-Side Filtreleme** - Kategori bazlı ürün filtreleme
- ✅ **Sayfalama (Pagination)** - Katalog sayfalarında dinamik sayfalama

## 🛠️ Teknoloji Yığını

- **Framework:** Astro v5
- **Stil:** Tailwind CSS v4
- **Dil:** TypeScript
- **İçerik:** Content Collections (Markdown + Zod)
- **Görsel Optimizasyonu:** Astro Image

## 📁 Proje Yapısı

```
yetiscorap/
├── public/
│   ├── images/
│   │   ├── placeholder.png          # Geçici placeholder
│   │   ├── products/                # Ürün görselleri buraya eklenecek
│   │   └── instagram/               # Instagram feed görselleri
│   └── favicon.svg
├── src/
│   ├── components/                  # Yeniden kullanılabilir bileşenler
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── WhatsAppButton.astro
│   │   ├── LanguageSwitcher.astro
│   │   ├── ProductCard.astro
│   │   └── InstagramFeed.astro
│   ├── content/
│   │   ├── config.ts               # Zod şeması
│   │   └── products/
│   │       ├── tr/                 # Türkçe ürünler
│   │       └── en/                 # İngilizce ürünler
│   ├── layouts/
│   │   └── BaseLayout.astro        # Ana layout
│   ├── pages/
│   │   ├── index.astro             # TR: Ana sayfa
│   │   ├── iletisim.astro          # TR: İletişim
│   │   ├── urunler/[...page].astro # TR: Katalog (sayfalama)
│   │   ├── urun/[slug].astro       # TR: Ürün detay
│   │   ├── 404.astro               # TR: 404
│   │   └── en/                     # EN sayfaları
│   │       ├── index.astro
│   │       ├── contact.astro
│   │       ├── products/[...page].astro
│   │       ├── product/[slug].astro
│   │       └── 404.astro
│   ├── styles/
│   │   └── global.css              # Global stiller
│   └── env.d.ts
├── astro.config.mjs                # Astro konfigürasyonu
├── tailwind.config.mjs             # Tailwind konfigürasyonu
├── tsconfig.json                   # TypeScript konfigürasyonu
├── package.json
└── README.md
```

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle

```bash
# npm kullanarak
npm install

# veya pnpm
pnpm install

# veya bun
bun install
```

### 2. Geliştirme Sunucusunu Başlat

```bash
npm run dev
# http://localhost:4321 adresinde açılır
```

### 3. Production Build

```bash
# TypeScript kontrolü ve build
npm run build
```

### 4. Build Önizleme

```bash
npm run preview
```

## 📝 İçerik Yönetimi

### Yeni Ürün Ekleme

1. **Ürün Görseli Ekle:**
   - Görseli `public/images/products/` klasörüne yükle
   - Örnek: `public/images/products/kod-14-bebek.jpg`

2. **Markdown Dosyası Oluştur:**

**TR Ürün** - `src/content/products/tr/kod-yeni-urun.md`:

```markdown
---
title: "Kod X - Yeni Ürün Adı"
sku: "Kod X"
category: "bebek" # veya "cocuk"
age_group: "0-6 Ay"
features:
  - "Özellik 1"
  - "Özellik 2"
  - "Özellik 3"
cover_image: "../../public/images/products/kod-x.jpg"
whatsapp_msg: "Kod X için fiyat teklifi almak istiyorum."
publishDate: 2025-01-20
---

## Ürün Açıklaması

Detaylı açıklama buraya...
```

**EN Ürün** - `src/content/products/en/kod-yeni-urun.md`:

```markdown
---
title: "Code X - New Product Name"
sku: "Code X"
category: "bebek"
age_group: "0-6 Months"
features:
  - "Feature 1"
  - "Feature 2"
cover_image: "../../public/images/products/kod-x.jpg"
publishDate: 2025-01-20
---

## Product Description

Detailed description here...
```

### Ürün Kategorileri

- `bebek` - Bebek (0-2 yaş)
- `cocuk` - Çocuk (3-12 yaş)

## 🌍 Dil Yapılandırması

### URL Yapısı

- **Türkçe (Varsayılan):**
  - Ana Sayfa: `yetiscorap.com/`
  - Ürünler: `yetiscorap.com/urunler`
  - Ürün Detay: `yetiscorap.com/urun/kod-14-bebek`
  - İletişim: `yetiscorap.com/iletisim`

- **İngilizce:**
  - Home: `yetiscorap.com/en`
  - Products: `yetiscorap.com/en/products`
  - Product Detail: `yetiscorap.com/en/product/kod-14-bebek`
  - Contact: `yetiscorap.com/en/contact`

### Dil Değiştirici

Mevcut sayfanın dil karşılığına otomatik yönlendirme yapar (ürün detay sayfaları dahil).

## 💬 WhatsApp Entegrasyonu

### Telefon Numarası

Numara: **0536 920 59 69** (Türkiye)

### Kullanım

```astro
<WhatsAppButton
  message="Sipariş mesajı"
  size="lg"
  label="WhatsApp ile İletişim"
/>

<!-- veya Floating Action Button -->
<WhatsAppButton
  message="Mesaj"
  variant="fab"
/>
```

## 🎨 Tasarım Sistemi

### Marka Renkleri

```css
--brand-pink: #F472B6
--brand-blue: #60A5FA
--brand-yellow: #FACC15
--brand-orange: #FB923C
--whatsapp-green: #25D366
```

### Tailwind Utility Classes

```html
<!-- Butonlar -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>

<!-- Kartlar -->
<div class="card">...</div>

<!-- Container -->
<div class="container">...</div>

<!-- Başlıklar -->
<h1 class="heading-xl">...</h1>
<h2 class="heading-lg">...</h2>
```

## 🚀 Deploy (Yayına Alma)

### Cloudflare Pages

1. **GitHub'a Push Et:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/kullaniciadi/yetiscorap.git
   git push -u origin main
   ```

2. **Cloudflare Pages'e Bağlan:**
   - [Cloudflare Dashboard](https://dash.cloudflare.com/) > Pages
   - "Create a project" > GitHub'dan repo seç
   - Build ayarları:
     - **Framework preset:** Astro
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
   - "Save and Deploy"

3. **Custom Domain Ekle:**
   - Pages dashboard > Custom domains
   - `yetiscorap.com` ekle
   - DNS ayarlarını güncelle (CNAME)

### Netlify

1. **GitHub'a Push Et** (yukarıdaki gibi)

2. **Netlify'a Deploy:**
   - [Netlify Dashboard](https://app.netlify.com/) > "Add new site"
   - GitHub'dan repo seç
   - Build ayarları:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - "Deploy site"

3. **Custom Domain:**
   - Site settings > Domain management
   - "Add custom domain"

### Vercel

```bash
# Vercel CLI ile
npm i -g vercel
vercel
```

## 📊 SEO Optimizasyonu

### JSON-LD Yapısal Veri

Her sayfada otomatik olarak eklenir:
- **Ana Sayfa:** Organization/WholesaleStore
- **İletişim:** LocalBusiness
- **Ürün Detay:** Product

### Meta Tags

- `title` ve `description` her sayfada özelleştirilmiş
- `og:` ve `twitter:` meta tags
- `hreflang` dil alternatifleri
- Canonical URL'ler

### Sitemap

Build sonrası otomatik oluşturulur: `dist/sitemap-index.xml`

## 🔧 Yapılandırma

### Site URL'sini Güncelle

`astro.config.mjs`:
```js
export default defineConfig({
  site: 'https://yetiscorap.com', // Buraya domain'i yaz
  ...
});
```

### İletişim Bilgilerini Güncelle

- **WhatsApp:** `src/components/WhatsAppButton.astro` - phoneNumber değişkeni
- **E-posta/Telefon:** `src/components/Footer.astro`
- **Harita:** `src/pages/iletisim.astro` ve `src/pages/en/contact.astro` - Google Maps iframe

## 📈 Performans İpuçları

1. **Görselleri Optimize Et:**
   - WebP/AVIF formatı kullan
   - Boyutları küçült (max 1000px genişlik)
   - Astro `<Image />` bileşeni otomatik optimize eder

2. **Lighthouse Testi:**
   ```bash
   npm run build
   npm run preview
   # Chrome DevTools > Lighthouse
   ```

3. **Bundle Analizi:**
   - Build sonrası `dist` klasörünün boyutunu kontrol et
   - Gereksiz JS/CSS'i temizle

## 🐛 Sorun Giderme

### Build Hatası: "Cannot find module"

```bash
# Cache'i temizle ve tekrar dene
rm -rf node_modules .astro
npm install
npm run build
```

### Görsel Yüklenmiyor

- Görselin `public/images/` altında olduğundan emin ol
- Markdown'da görsel yolu: `../../public/images/placeholder.png`
- Build sonrası `dist/images/` klasörünü kontrol et

### i18n Routing Çalışmıyor

- `astro.config.mjs` içinde `prefixDefaultLocale: false` olduğundan emin ol
- EN sayfalar `/en` altında, TR sayfalar root'ta olmalı

## 📞 İletişim & Destek

- **Firma:** Yetiş Çorap Tekstil Çamaşır İth. İhr. Ltd. Şti.
- **Adres:** Oruçreis Mah. Giyimkent 4 Sokak No:50, Esenler/İstanbul
- **Tel:** 0536 920 59 69
- **E-Posta:** yetiscorap@hotmail.com

## 📄 Lisans

Bu proje Yetiş Çorap için özel olarak geliştirilmiştir.

---

**Son Güncelleme:** 2025-01-19

**Geliştirici Notları:**
- Gerçek ürün görsellerini ekleyin
- Google Maps iframe URL'sini güncelleyin
- Instagram widget kodunu ekleyin (opsiyonel)
- Analytics kodu ekleyin (Google Analytics/Meta Pixel)
- Favicon'u özelleştirin
