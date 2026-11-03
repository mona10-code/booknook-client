"use client";
import { useEffect, useRef } from "react";
import Swiper from "swiper";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const sliderData = [
  {
    id: 1,
    title: "Discover Your Next Favorite Book",
    text: "Explore our vast collection of books from various genres and dive into a new world.",
    img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Borrow Books Easily",
    text: "Just a few clicks and the book is yours for a few days. Reading has never been this easy.",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Add and Share Your Collection",
    text: "Have books you love? Add them to our library and share the joy of reading with others.",
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function Banner() {
  const swiperRef = useRef(null);

  useEffect(() => {
    
    if (swiperRef.current) {
      const swiper = new Swiper(swiperRef.current, {
        modules: [Autoplay, Pagination, Navigation],
        spaceBetween: 0,
        centeredSlides: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });

      return () => {
        swiper.destroy(true, true);
      };
    }
  }, []);

  return (
    <div className="w-full h-[60vh] md:h-[75vh] bg-base-200">
      {/* Swiper */}
      <div ref={swiperRef} className="swiper w-full h-full">
        <div className="swiper-wrapper">
          {sliderData.map((slide) => (
            <div key={slide.id} className="swiper-slide">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.img})` }}
                ></div>
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Text Content */}
                <div className="relative z-10 text-center text-white px-4 max-w-3xl">
                  <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-base md:text-xl mb-8 text-gray-200">
                    {slide.text}
                  </p>
                  <Link href="/books" className="btn btn-primary btn-md md:btn-lg px-8">
                    Browse Books
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* নেভিগেশন এবং পেজিনেশন কন্ট্রোল */}
        <div className="swiper-pagination bottom-6"></div>
        <div className="swiper-button-next text-white right-4"></div>
        <div className="swiper-button-prev text-white left-4"></div>
      </div>
    </div>
  );
}