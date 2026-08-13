"use client";

import { useState } from "react";
import Heading from "@/app/components/ui/Heading";
import Paragraph from "@/app/components/ui/Paragraph";
import Button from "@/app/components/ui/Button";
import AppImage from "@/app/components/ui/Image";
import {
  ScreenSize,
  CPU,
  Cores,
  MainCamera,
  FrontCamera,
  Battery,
  Delivery,
  Guarentee,
  Stock,
} from "@/app/icons";
import { cn } from "@/lib/cn";

const iconMap = {
  ScreenSize,
  CPU,
  Cores,
  MainCamera,
  FrontCamera,
  Battery,
  Delivery,
  Guarentee,
  Stock,
};

function ProductGallery({ images, thumbnail, name }) {
  const galleryImages =
    images?.length > 0
      ? images
      : thumbnail
        ? [thumbnail]
        : [];

  const [activeImage, setActiveImage] = useState(galleryImages[0] || "");

  if (!galleryImages.length) {
    return (
      <div className="flex-1 w-full min-h-[329px] md:min-h-[516px] flex items-center justify-center">
        <Paragraph type="body" className="text-muted">No image</Paragraph>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse xl:flex-row gap-[33px] items-center md:gap-[48px]">
      <div className="flex xl:flex-col gap-[33px] md:gap-[24px]">
        {galleryImages.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(image)}
            className={cn(
              "relative lg:h-[93px] lg:w-[74px] h-[67px] w-[56px] rounded-[8px] overflow-hidden cursor-pointer border-2 border-surface-card",
            )}
          >
            <AppImage
              src={image}
              alt={name}
              width={74}
              height={93}
              className="h-full w-full object-contain"
            />
             {activeImage !== image && (
          <div className="absolute inset-0 bg-white/60 pointer-events-none" />
        )}
          </button>
        ))}
      </div>
      <div className="flex-1 w-full min-h-[329px] md:min-h-[516px] flex items-center justify-center">
        <AppImage
          src={activeImage}
          alt={name}
          width={420}
          height={420}
          className="w-full max-w-[263px] md:max-w-[420px] h-auto object-contain"
          priority
        />
      </div>
    </div>
  );
}

function InfoCard({ product }) {
  const [selectedStorage, setSelectedStorage] = useState(product.selectedStorage);
  const [selectedColor, setSelectedColor] = useState(product.selectedColor);

  return (
    <div className="flex flex-col gap-[24px]">
      <Heading as="h1" variant="productTitle">
        {product.name}
      </Heading>

      <div className="flex flex-col gap-[16px]">
        <div className="flex gap-[13px] items-center">
          <Paragraph type="productPrice">
            {product.currency}
            {product.price.toFixed(2)}
          </Paragraph>
          <Paragraph type="productOriginalPrice">
            {product.currency}
            {product.originalPrice.toFixed(2)}
          </Paragraph>
        </div>

        {/* <div className="flex gap-[24px] items-center">
          <Paragraph type="productColor">{product.ui.selectColor}</Paragraph>
          <div className="flex gap-[8px]">
            {product.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                aria-label={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={cn(
                  "w-[32px] h-[32px] rounded-full cursor-pointer border-2",
                  selectedColor === color.name ? "border-primary" : "border-transparent"
                )}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div> */}

        {/* <div className="grid grid-cols-4 gap-[8px] md:gap-[16px] items-center w-full pt-[8px]">
          {product.storage.map((storage) => (
            <button
              key={storage}
              type="button"
              className={cn(
                "flex-1 h-[48px] text-center border rounded-[8px] px-[16px] py-[12px] text-[14px] font-[500] cursor-pointer",
                selectedStorage === storage
                  ? "border-primary text-primary"
                  : "border-primary-border text-muted-light"
              )}
              onClick={() => setSelectedStorage(storage)}
            >
              {storage}
            </button>
          ))}
        </div> */}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-[8px] md:gap-[16px] items-center w-full pt-[8px]">
          {product.specifications.map((specification) => {
            const Icon = iconMap[specification.icon];
            return (
              <div
                key={specification.name}
                className="flex items-center gap-[8px] bg-card-light rounded-[8px] py-[16px] px-[8px]"
              >
                <div className="w-[24px] h-[24px] shrink-0">{Icon ? <Icon /> : null}</div>
                <div className="flex flex-col gap-[0px]">
                  <Paragraph type="cart" className="text-muted-light">
                    {specification.name}
                  </Paragraph>
                  <Paragraph type="cart" className="text-muted-dark">
                    {specification.value}
                  </Paragraph>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-[8px]">
          <Paragraph type="body" className="!text-muted-nav !tracking-[0.35px]">
            {product.description}
          </Paragraph>
        </div>
      </div>
    </div>
  );
}

export default function ProductPurchase({ product }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[36px] md:gap-[48px] items-center">
      <div className="col-span-1">
        <ProductGallery
          images={product.images}
          thumbnail={product.thumbnail}
          name={product.name}
        />
      </div>

      <div className="col-span-1">
        <InfoCard product={product} />

        <div className="w-full pt-[32px] flex flex-col sm:flex-row gap-[16px]">
  <Button
    variant="dark"
    className="w-full sm:flex-1 !min-w-0 !h-[56px]"
  >
    Add to Wishlist
  </Button>

  <Button
    variant="fill-dark"
    className="w-full sm:flex-1 !min-w-0 !h-[56px]"
  >
    Add to Cart
  </Button>
</div>

        <div className="pt-[32px]">
          <div className="flex gap-[16px] sm:gap-[28px]">
            {product.delivery.map((delivery) => {
              const Icon = iconMap[delivery.icon];
              return (
                <div key={delivery.title} className="flex-1 flex flex-col md:flex-row items-center justify-center gap-[16px]">
                  <div className="w-[56px] h-[56px] bg-card-light rounded-[8px] flex items-center justify-center shrink-0">
                    {Icon ? <Icon /> : null}
                  </div>
                  <div className="flex flex-col gap-[0px]">
                    <Paragraph type="body" className="!text-muted-nav">
                      {delivery.title}
                    </Paragraph>
                    <Paragraph type="body" className="!text-muted-dark !font-[500]">
                      {delivery.time}
                    </Paragraph>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
