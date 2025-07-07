"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDiscountBanners } from '@/service/books/book';

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const discountBanners = await getDiscountBanners();
        
        if (discountBanners && discountBanners.length > 0) {
          const formattedBanners = discountBanners.map(banner => ({
            id: banner.discountId,
            image: banner.discImage,
            name: banner.discountName,
            percentage: banner.discountPercentage,
            startDate: banner.startDate,
            endDate: banner.endDate
          }));
          
          setBanners(formattedBanners);
        } else {
          setBanners([
            { id: 1, image: "/bannernuriya.jpeg" }
          ]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке баннеров:", error);
        setBanners([
          { id: 1, image: "/bannernuriya.jpeg" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    if (banners.length > 1) {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }
  };

  const prevSlide = () => {
    if (banners.length > 1) {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  if (loading) {
    return (
      <div className="relative w-full max-w-[1440px] mx-auto h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] bg-gray-100 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400 text-sm sm:text-base">Загрузка баннеров...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[1440px] mx-auto">
      <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full w-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <div 
              key={banner.id} 
              className="w-full flex-shrink-0 relative h-full"
            >
              <Image
                src={banner.image}
                alt={banner.name || "Баннер скидок"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1440px"
                className="object-cover"
                priority
              />
              {banner.percentage && (
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-5 md:right-5 lg:bottom-6 lg:right-6 bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full font-bold text-sm sm:text-base md:text-lg lg:text-xl">
                  Скидка {banner.percentage}%
                </div>
              )}
            </div>
          ))}
        </div>

        {banners.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full ${
                  currentSlide === index ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        )}

        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 bg-white/70 p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-full shadow-md hover:bg-white transition"
              aria-label="Мурдагы баннер"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 bg-white/70 p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-full shadow-md hover:bg-white transition"
              aria-label="Кийинки баннер"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-gray-700" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}