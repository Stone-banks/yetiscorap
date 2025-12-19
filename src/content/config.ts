import { defineCollection, z } from 'astro:content';

/**
 * Ürün Koleksiyonu Zod Şeması
 * Yetiş Çorap ürünlerinin veri yapısını tanımlar
 *
 * Koleksiyon Yapısı:
 * - src/content/products/tr/ (Türkçe ürünler)
 * - src/content/products/en/ (İngilizce ürünler)
 *
 * Not: Aynı ürünün TR/EN dosyaları aynı slug'a sahip olmalı
 * Örnek: kod-14-bebek.md her iki dilde de aynı slug
 */

const productsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    /**
     * Ürün adı
     * Örnek: "Kod 14 - Fırfırlı Bebek Çorabı"
     */
    title: z.string(),

    /**
     * Stok kodu (SKU)
     * Örnek: "Kod 14", "Kod 01"
     */
    sku: z.string(),

    /**
     * Kategori
     * Sadece bebek ve çocuk (0-12 yaş arası)
     */
    category: z.enum(['bebek', 'cocuk']),

    /**
     * Yaş grubu
     * Örnek: "0-6 Ay", "7-8 Yaş"
     */
    age_group: z.string(),

    /**
     * Ürün özellikleri
     * Örnek: ["Kaymaz Taban", "Pamuklu", "Elastik Ağız"]
     */
    features: z.array(z.string()),

    /**
     * Kapak görseli (public klasöründen absolute path)
     * Görseller public/images/ klasöründe olmalı
     * Örnek: "/images/placeholder.png" veya "/images/products/kod-14.jpg"
     *
     * Gerçek görselleri eklemek için:
     * 1. public/images/products/ klasörüne görselleri yükle
     * 2. Bu alanı güncelle: cover_image: "/images/products/kod-14-bebek.jpg"
     */
    cover_image: z.string(),

    /**
     * WhatsApp sipariş mesajı (opsiyonel)
     * Belirtilmezse varsayılan mesaj kullanılır
     */
    whatsapp_msg: z.string().optional(),

    /**
     * Yayın tarihi (sıralama için)
     * coerce: string formatındaki tarihler otomatik Date'e çevrilir
     */
    publishDate: z.coerce.date().optional()
  })
});

/**
 * Collections Export
 * Astro'nun Content Collections API'si için
 */
export const collections = {
  products: productsCollection
};
