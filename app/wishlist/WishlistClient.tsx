"use client";

import { useEffect, useState } from "react";
import Heading from "@/components/ui/Heading";
import ProductCard from "@/components/ui/ProductCard";
import AppImage from "@/components/ui/Image";
import { useSelector } from "@/redux/hooks";

type Product = {
  id: number;
  title: string;
  brand?: string;
  price: number;
  thumbnail: string;
};

export default function WishlistClient() {
  const wishlist = useSelector(
    (state) => state.wishlist.wishlist
  );
  const ready = useSelector(
    (state) => state.wishlist.ready
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!wishlist.length) {
        setProducts([]);
        return;
      }

      try {
        setLoading(true);

        const products = await Promise.all(
          wishlist.map(async (id) => {
            const response = await fetch(
              `https://dummyjson.com/products/${id}`
            );

            if (!response.ok) {
              throw new Error(`Failed to fetch product ${id}`);
            }

            return response.json();
          })
        );

        setProducts(products);
      } catch (error) {
        console.error("Failed to fetch wishlist products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  return (
    <div className="flex justify-center items-center">
    <div className="container pt-[63px] pb-[58px] 2xl:py-[80px]">
      <Heading
        as="h1"
        variant="section"
        className="mb-[32px] tracking-normal"
      >
        Wishlist
      </Heading>

      {loading && <p>Loading wishlist...</p>}

      {!loading && products.length === 0 && ready && (
        <div className="flex flex-col justify-center items-center">
        <AppImage 
          src="/website/no-products.avif"
          alt="Empty Wishlist"
          width={500}
          height={500}
          className=""
        />
        <Heading as="h2" variant="section">
          Your Wishlist Is Empty
        </Heading>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            brand={product.brand}
            price={product.price}
            thumbnail={product.thumbnail}
            buttonText="Add to Cart"
          />
        ))}
      </div>
    </div>
    </div>
  );
}