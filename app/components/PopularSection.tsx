"use client";

import { useEffect, useRef, useState } from "react";
import homepage from "@/data/homepage.json";
import PopularCard from "./ui/PopularCard";

const { popular } = homepage;

export default function PopularSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = popular.items.length;

  const goToSlide = (index: number) => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollTo({
      left: index * carouselRef.current.clientWidth,
      behavior: "smooth",
    });

    setActiveIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const next = current === totalSlides - 1 ? 0 : current + 1;

        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            left: next * carouselRef.current.clientWidth,
            behavior: "smooth",
          });
        }

        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const handleScroll = () => {
    if (!carouselRef.current) return;

    const index = Math.round(
      carouselRef.current.scrollLeft / carouselRef.current.clientWidth
    );

    setActiveIndex(index);
  };

  const dots = (
    <div className="flex items-center justify-center gap-[8px]">
      {popular.items.map((product, index) => (
        <button
          key={product.id}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          onClick={() => goToSlide(index)}
          className={`h-[8px] w-[8px] rounded-full transition-all duration-300 ${
            activeIndex === index ? "scale-125 bg-primary" : "bg-surface-gray"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {/* Mobile carousel — height follows content, max 723px */}
      <div className="max-h-[723px] w-full overflow-hidden md:hidden">
        <div
          // ref={carouselRef}
          onScroll={handleScroll}
          className="flex h-auto max-h-[723px] w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scrollbar-hide"
        >
          {popular.items.map((product) => (
            <div
              key={product.id}
              className="h-auto w-full min-w-full shrink-0 snap-center"
            >
              <PopularCard {...product} dots={dots} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4">
        {popular.items.map((product) => (
          <PopularCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
