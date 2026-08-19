"use client";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Button from "@/components/ui/Button";
import AppImage from "@/components/ui/Image";
import { DownArrow, Star, UpArrow } from "@/icons";
import { cn } from "@/lib/cn";
import Input from "./ui/Input";
import {useState} from "react";

type RatingBreakdown = {
  label: string;
  count: number;
};

type ReviewItem = {
  id: number;
  name: string;
  rating: number;
  date: string;
  avatar?: string;
  comment: string;
  images?: string[];
};

type ProductReviewsProps = {
  title: string;
  rating: number;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown[];
  items: ReviewItem[];
  viewMoreLabel?: string;
  fromReviewsLabel?: string;
};

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  return (
    <div className={cn("flex items-center", size === "md" ? "gap-[0px]" : "gap-[4px]")}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          filled={index < Math.round(rating)}
          className={size === "md" ? "w-[24px] h-[24px]" : "w-[16px] h-[16px]"}
        />
      ))}
    </div>
  );
}

function Avatar({ name, src }: { name: string; src?: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <AppImage
        src={src}
        alt={name}
        width={56}
        height={56}
        className="h-[56px] w-[56px] rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-card-light text-[16px] font-[500] text-muted-dark">
      {initials}
    </div>
  );
}

export default function ProductReviews({
  title,
  rating,
  totalReviews,
  ratingBreakdown,
  items,
  viewMoreLabel = "View More",
  fromReviewsLabel = "of {count} reviews",
}: ProductReviewsProps) {
  const maxCount = Math.max(...ratingBreakdown.map((item) => item.count), 1);
  const fromLabel = fromReviewsLabel.replace("{count}", String(totalReviews));
  const [initial, setInitial] = useState(2);
  const [showMore, setShowMore] = useState(false);
  return (
    <>
    <section className="flex flex-col gap-[46px] md:gap-[48px]">
      <Heading as="h2" variant="section">
        {title}
      </Heading>

      <div className="grid grid-cols-1 md:grid-cols-[184px_1fr] gap-[60px] items-center">
        <div className="flex flex-col items-center justify-center gap-[16px] bg-surface-soft py-[32px] px-[32px] rounded-[12px]">
          <div className="flex items-center justify-center gap-[30px]">
            <div className="flex flex-col items-center justify-center gap-[16px]">
            <Paragraph className="!text-[56px] !font-[500] !leading-[56px] !tracking-[-0.5px] text-primary">
            {rating.toFixed(1)}
          </Paragraph>
          <div className="md:hidden block">
 <Paragraph type="form2" className="!text-muted-light !font-[400]">
            {fromLabel}
          </Paragraph>
          </div>
         
            </div>
              
          <div className="md:hidden block">
            <Stars rating={rating} size="md" />
          </div>
          
          </div>
        
          <div className="md:block hidden">
            <Paragraph type="form2" className="!text-muted-light !font-[400]">
            {fromLabel}
          </Paragraph>
        </div>
          
          <div className="md:block hidden">
            <Stars rating={rating} size="md" />
          </div>
        </div>

        <div className="flex flex-col gap-[25px] w-full">
          {ratingBreakdown.map((item) => (
            <div key={item.label} className="grid md:grid-cols-[150px_1fr_32px] grid-cols-[116px_1fr_32px] items-center gap-[18px]">
              <Paragraph type="starLabel" className="!text-muted-dark !font-[400]">
                {item.label}
              </Paragraph>
              <div className="h-[4px] w-full rounded-full bg-card-light overflow-hidden">
                <div
                  className="h-full rounded-full bg-yellow-line"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <Paragraph type="cart" className="!text-muted-dark !font-[400] text-right">
                {item.count}
              </Paragraph>
            </div>
          ))}
        </div>
      </div>
      <div className="relative w-full border-primary-border border-[1px] rounded-[12px] px-[16px]">
        <Input placeholder="Leave comment" className="!h-[62px] border-primary-border w-full focus:outline-none focus:ring-0" inlineButton={true} buttonText="Submit" />
      </div>

      
    </section>
    <div className="flex flex-col gap-[24px] pt-[32px]">
    {items.slice(0, showMore ? items.length : initial).map((review) => (
      <article
        key={review.id}
        className="rounded-[12px] bg-surface-card py-[24px] px-[16px] flex flex-col gap-[16px] "
      >
        <div className="flex  items-start justify-between gap-[18px]">
        <Avatar name={review.name} src={review.avatar || undefined} />
          <div className="flex flex-col items-start gap-[8px] justify-between w-full">
         
            <div className="flex items-start justify-between md:gap-[16px] w-full">
              <div className="flex flex-col items-start gap-[8px]">
              <Paragraph type="address" className="!font-[500] !text-[18px]">
                {review.name}
              </Paragraph>
              <Stars rating={review.rating} size="md" />
              </div>

           
            
              <Paragraph type="cart" className="!text-muted-light !font-[400] shrink-0">
            {review.date}
          </Paragraph>
          </div>

          <Paragraph type="body" className="!text-muted-nav !text-[15px] !leading-[24px]">
          {review.comment}
        </Paragraph>
        {review.images?.length ? (
          <div className="flex  gap-[8px]">
            {review.images.map((image) => (
              <AppImage
                key={image}
                src={image}
                alt={`${review.name} review`}
                width={118}
                height={88}
                className="md:h-[88px] h-[68px] md:w-[118px] w-[88px] rounded-[8px] object-cover bg-secondary"
              />
            ))}
          </div>
        ) : null}
          </div>
          
          <div>
         
          </div>
          
        </div>

       

       
      </article>
    ))}
  </div>

  {items.length > 2 && (
  <div className="flex justify-center pt-[24px]">
    <Button
      variant="dark"
      className="group gap-[8px] !min-w-[216px] !h-[48px] transition-all duration-300"
      onClick={() => setShowMore((prev) => !prev)}
    >
      {showMore ? "Show Less" : viewMoreLabel}

      {showMore ? <DownArrow /> : <UpArrow />}
    </Button>
  </div>
)}
  </>
  );
}
