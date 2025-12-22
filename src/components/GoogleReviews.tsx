import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

interface Review {
  id: number;
  name: string;
  location: string;
  initial: string;
  color: string;
  rating: number;
  text: string;
  reviewCount: number;
  badge: string;
  timeAgo: string;
}

const GoogleReviews = () => {
  const reviews: Review[] = [
    {
      id: 1,
      name: "Yakup S.",
      location: "Antalya",
      initial: "Y",
      color: "bg-blue-500",
      rating: 5,
      text: "Siparişlerimiz çok hızlı hazırlandı. Modeller gerçekten trend ve fotoğraflardakiyle birebir geldi. Emeğinize sağlık.",
      reviewCount: 5,
      badge: "Yerel Rehber",
      timeAgo: "3 gün önce"
    },
    {
      id: 2,
      name: "Mehmet T.",
      location: "İstanbul",
      initial: "M",
      color: "bg-green-500",
      rating: 5,
      text: "Giyimkent'teki mağazamız için uzun süredir birlikte çalışıyoruz. Stok konusunda hiç sıkıntı yaşamadık, gönül rahatlığıyla öneririm.",
      reviewCount: 12,
      badge: "Tekrar sipariş verildi",
      timeAgo: "1 hafta önce"
    },
    {
      id: 3,
      name: "Selin A.",
      location: "İzmir",
      initial: "S",
      color: "bg-pink-500",
      rating: 5,
      text: "Pamuk kalitesi beklediğimizden daha iyi çıktı. Müşterilerden olumlu geri dönüş aldık. Sevkiyat da oldukça hızlıydı, teşekkürler.",
      reviewCount: 8,
      badge: "Kalite onayı",
      timeAgo: "2 hafta önce"
    },
    {
      id: 4,
      name: "Burak K.",
      location: "Ankara",
      initial: "B",
      color: "bg-amber-500",
      rating: 5,
      text: "Toptan alımda bu kadar ilgili ve ulaşılabilir bir ekip bulmak zor. Yeni sezon ürünler çok başarılı, işimiz gerçekten kolaylaştı.",
      reviewCount: 3,
      badge: "Yeni sezon bekleniyor",
      timeAgo: "1 ay önce"
    },
    {
      id: 5,
      name: "Ahmet Y.",
      location: "Bursa",
      initial: "A",
      color: "bg-purple-500",
      rating: 5,
      text: "Bursa'daki butiğimiz için toplu alım yaptık. Ürünlerin paketlenmesi ve hızı bizi şaşırttı. Kumaşlar gerçekten 1. sınıf pamuk, müşterilerimiz dokusuna bayıldı.",
      reviewCount: 7,
      badge: "Güvenilir Mağaza",
      timeAgo: "2 ay önce"
    }
  ];

  const [isDragging, setIsDragging] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const scrollToCard = (index: number) => {
    const container = document.getElementById('reviews-container');
    if (container) {
      const cardWidth = container.children[index] as HTMLElement;
      const scrollPosition = cardWidth.offsetLeft - (container.offsetWidth - cardWidth.offsetWidth) / 2;
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            Müşterilerimizin <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-400">Google Yorumları</span>
          </h2>
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span className="text-sm text-slate-500">
              Google Haritalar'dan doğrudan yorumlar
            </span>
          </div>
        </div>

        {/* Reviews Slider */}
        <div className="relative">
          {/* Navigasyon Okları - Modern Glassmorphism Style */}
          <button
            onClick={() => {
              handlePrev();
              scrollToCard(currentIndex - 1 < 0 ? reviews.length - 1 : currentIndex - 1);
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-10 h-10 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-full border border-white/20 shadow-lg items-center justify-center z-10 transition-all duration-200 hover:scale-110 flex"
          >
            <HiChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <button
            onClick={() => {
              handleNext();
              scrollToCard(currentIndex + 1 >= reviews.length ? 0 : currentIndex + 1);
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-10 h-10 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-full border border-white/20 shadow-lg items-center justify-center z-10 transition-all duration-200 hover:scale-110 flex"
          >
            <HiChevronRight className="w-5 h-5 text-slate-700" />
          </button>

          <div
            id="reviews-container"
            className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-4 scrollbar-hide cursor-grab active:cursor-grabbing scroll-smooth px-2 -mx-2"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onScroll={(e) => {
              const container = e.currentTarget;
              const scrollLeft = container.scrollLeft;
              const containerWidth = container.offsetWidth;
              const newIndex = Math.round(scrollLeft / (containerWidth + 24)); // 24px is gap
              setCurrentIndex(newIndex);
            }}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              touchAction: 'pan-x pan-y'
            }}
          >
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: review.id * 0.1 }}
                className={`flex-shrink-0 w-[75vw] sm:w-80 md:w-96 bg-white/95 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl border border-slate-100/50 transition-all duration-300 snap-center ${
                  index === currentIndex ? 'ring-2 ring-pink-200' : ''
                }`}
              >
                {/* Review Card */}
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Profile Initial */}
                      <div className={`w-10 h-10 ${review.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                        {review.initial}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{review.name}</h3>
                        <p className="text-sm text-slate-500">{review.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Google Logo */}
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-xs text-slate-400">{review.timeAgo}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-700 text-sm leading-relaxed mb-3">
                    {review.text}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-600">
                      {review.reviewCount} yorum • <span className="text-blue-600 font-semibold">{review.badge}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Daha Fazla Yorum Gör Butonu */}
          <div className="text-center mt-6">
            <motion.a
              href="https://maps.app.goo.gl/btf6xuFSQuvyBW117"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold rounded-full hover:from-pink-600 hover:to-pink-500 transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.656 13.943L12 14.699l-2.656-.756L12 13.187v4.413h.038c.795 0 1.511-.353 2.014-.914l6.45-7.378a3.975 3.975 0 0 0-.416-.104c-.543-.109-1.222.021-2.013.414-.79.393-1.578.998-2.225 1.731-.647.734-1.083 1.525-1.261 2.292-.178.766-.1 1.454.216 2.004l.017.031z"/>
                <path d="M21.023 7.976c-.109-.543-.398-1.083-.914-1.587l-7.378-6.45a3.975 3.975 0 0 0-.104-.416c-.109.543.021 1.222.414 2.013.393.79.998 1.578 1.731 2.225.734.647 1.525 1.083 2.292 1.261.766.178 1.454.1 2.004-.216l.031-.017l.756 2.656L13.187 12h4.413c0 .795-.353 1.511-.914 2.014l-.27.236c.444.128.906.195 1.377.195 2.493 0 4.5-2.007 4.5-4.5 0-.471-.067-.933-.195-1.377l.236-.27z"/>
                <path d="M7.976 21.023c.543-.109 1.083-.398 1.587-.914l6.45-7.378c.128-.444.195-.906.195-1.377 0-2.493-2.007-4.5-4.5-4.5-.471 0-.933.067-1.377.195l-.27.236L9.001 7.85c-.79.393-1.578.998-2.225 1.731-.647.734-1.083 1.525-1.261 2.292-.178.766-.1 1.454.216 2.004l.017.031c.543.109 1.222-.021 2.013-.414.79-.393 1.578-.998 2.225-1.731.647-.734 1.083-1.525 1.261-2.292.178-.766.1-1.454-.216-2.004l-.017-.031z"/>
              </svg>
              <span>Daha Fazla Yorum Gör</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default GoogleReviews;