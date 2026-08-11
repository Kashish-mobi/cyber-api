import Heading from "./ui/Heading";
import ProductCard from "./ui/ProductCard";
import ProductGrid from "./ui/ProductGrid";

export type DiscountedProduct = {
  id: string;
  title: string;
  title2?: string;
  price: number;
  image: string;
};

type DiscountedSectionProps = {
  title: string;
  items: DiscountedProduct[];
  buttonText?: string;
  currencySymbol?: string;
};

export default function DiscountedSection({
  title,
  items,
  buttonText = "Buy Now",
  currencySymbol = "$",
}: DiscountedSectionProps) {
  return (
    <div className="w-full flex items-center justify-center">
      <section className="container pt-[63px] pb-[58px] 2xl:py-[80px]">
        <Heading as="h2" variant="section" className="mb-[32px] tracking-normal">
          {title}
        </Heading>

        <ProductGrid>
          {items.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              title2={product.title2}
              price={product.price}
              image={product.image}
              buttonText={buttonText}
              currencySymbol={currencySymbol}
            />
          ))}
        </ProductGrid>
      </section>
    </div>
  );
}
