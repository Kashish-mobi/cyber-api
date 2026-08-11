import Heading from "../components/ui/Heading";
import Paragraph from "../components/ui/Paragraph";
import ProductCard from "../components/ui/ProductCard";
const wishlistPageData = {
  title: "Wishlist",
  description: "Save your favorite products here and come back when you're ready.",
  "items": [
    {
      "id": "discounted-product-1",
      "title": "Apple iPhone 14 Pro 512GB",
      "title2": "Gold (MQ233)",
      "price": 1437,
      "image": "/website/discount/d1.png"
    },
    {
      "id": "discounted-product-2",
      "title": "AirPods Max Silver",
      "title2": "Starlight Aluminium",
      "price": 549,
      "image": "/website/discount/d2.png"
    },
    {
      "id": "discounted-product-3",
      "title": "Apple Watch Series 9 GPS",
      "title2": "41mm Starlight Aluminium",
      "price": 399,
      "image": "/website/discount/d3.png"
    },
    {
      "id": "discounted-product-4",
      "title": "Apple iPhone 14 Pro 1TB Gold",
      "title2": "(MQ2V3)",
      "price": 1499,
      "image": "/website/discount/d4.png"
    }
  ],
};

export default function WishlistPage() {
  return (
    <div className="container pt-[63px] pb-[58px] 2xl:py-[80px]">
      <Heading as="h1" variant="section" className="mb-[32px] tracking-normal">{wishlistPageData.title}</Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {wishlistPageData.items.map((item) => (
          <ProductCard key={item.id} 
           id={item.id}
           title={item.title}
           title2={item.title2}
           price={item.price}
           image={item.image}
           buttonText={"Add to Cart"}
           currencySymbol="$"
          />
        ))}
      </div>
    </div>
  );
}