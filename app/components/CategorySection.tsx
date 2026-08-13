"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import homepage from "@/data/homepage.json";
import { cn } from "@/lib/cn";
import { getIcon, type IconName } from "@/lib/icons";
import { LeftArrow, RightArrow } from "../icons";
import Heading from "./ui/Heading";

const { categories } = homepage;

/** How many cards show at once for the current screen size. */
function getVisibleCount(width: number) {
  if (width >= 1300) return 6;
  if (width >= 768) return 4;
  return 6;
}

export default function CategorySection() {
  const { title, items } = categories;

  const [visibleCount, setVisibleCount] = useState(6);
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = Math.max(items.length - visibleCount, 0);

  // Clamp the index during render instead of using an effect
  const safeIndex = Math.min(currentIndex, maxIndex);

  const visibleItems = items.slice(
    safeIndex,
    safeIndex + visibleCount
  );

  useEffect(() => {
    const update = () => {
      setVisibleCount(getVisibleCount(window.innerWidth));
    };

    update();

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <div className="flex flex-col items-center justify-center bg-surface-soft">
      <div className="container py-[64px] md:py-[80px]">
        <div className="flex items-center justify-between">
          <Heading as="h2" variant="section">
            {title}
          </Heading>

          <div className="flex gap-[16px]">
            <button
              type="button"
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handlePrev}
              disabled={safeIndex === 0}
            >
              <LeftArrow />
            </button>

            <button
              type="button"
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleNext}
              disabled={safeIndex >= maxIndex}
            >
              <RightArrow />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "mt-[48px] md:mt-[32px] grid gap-[16px] md:gap-[32px]",
            "grid-cols-2",
            "md:grid-cols-4",
            "desktop:grid-cols-6"
          )}
        >
          {visibleItems.map((category) => {
            const Icon = getIcon(category.icon as IconName);

            return (
              <Link
                key={category.name}
                href={`/products?category=${category.slug}`}
                className="flex h-[128px] md:h-[112px] w-full flex-col items-center justify-center gap-[8px] rounded-[15px] bg-surface-gray px-[8px] py-[24px] md:py-[16px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.1)] md:h-[128px]"
              >
                {Icon ? <Icon /> : null}

                <span className="text-center text-[16px] font-[500] leading-[20px]">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}