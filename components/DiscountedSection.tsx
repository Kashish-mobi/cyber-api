import Heading from "./ui/Heading";
import ProductCard from "./ui/ProductCard";
import ProductGrid from "./ui/ProductGrid";

export type DiscountedProduct = {
  id: number;
  title: string;
  brand?: string;
  title2?: string;
  price: number;
  thumbnail: string;
};

type DiscountedSectionProps = {
  title: string;
  items: DiscountedProduct[];
  buttonText?: string;
};

export default function DiscountedSection({
  title,
  items,
  buttonText = "View Product",
}: DiscountedSectionProps) {
  return (
    <div className="w-full flex items-center justify-center" data-testid="discount-section">
      <section className="container pt-[63px] pb-[58px] 2xl:py-[80px]">
        <Heading as="h2" variant="section" className="mb-[32px] tracking-normal">
          {title}
        </Heading>

        <ProductGrid>
          {items.map((product) => (
            <ProductCard
              key={product.id}
              id={Number(product.id)}
              title={product.title}
              brand={product.brand}
              title2={product.title2}
              price={product.price}
              thumbnail={product.thumbnail}
              buttonText={buttonText}
            />
          ))}
        </ProductGrid>
      </section>
    </div>
  );
}
