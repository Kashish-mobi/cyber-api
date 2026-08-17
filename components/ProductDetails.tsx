import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Button from "@/components/ui/Button";
import { UpArrow } from "@/icons";

type SpecValue = string | string[];

type Spec = {
  name: string;
  value: SpecValue;
};

type DetailsSection = {
  title: string;
  specifications: Spec[];
};

type ProductDetailsProps = {
  title: string;
  description: string;
  sections: DetailsSection[];
  viewMoreLabel?: string;
};

function SpecValue({ value }: { value: SpecValue }) {
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-col items-end gap-[8px] text-right ">
        {value.map((item) => (
          <Paragraph key={item} type="cart" className="!text-muted-dark !font-[400] xl:!text-[15px]">
            {item}
          </Paragraph>
        ))}
      </div>
    );
  }

  return (
    <Paragraph type="cart" className="!text-muted-dark !font-[400] text-right mt-[2px]">
      {value}
    </Paragraph>
  );
}

export default function ProductDetails({
  title,
  description,
  sections,
  viewMoreLabel = "View More",
}: ProductDetailsProps) {
  return (
    <section className="flex flex-col gap-[32px]">
      <Heading as="h2" variant="section">
        {title}
      </Heading>

      <Paragraph type="body" className="!text-gray-desc !text-[16px] !leading-[24px] !tracking-[-0.9px]">
        {description}
      </Paragraph>

      <div className="flex flex-col md:gap-[52px] gap-[57px]">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-[16px]">
            <Heading as="h3" variant="checkoutStepTitle" className="!text-[20px] !tracking-[0.2px]">
              {section.title}
            </Heading>
            <div className="flex flex-col gap-[23px] md:gap-[24px]">
              {section.specifications.map((spec) => (
                <div
                  key={spec.name}
                  className="flex items-start justify-between gap-[24px] border-b border-dashed border-primary-border pb-[8px] last:border-0 last:pb-0"
                >
                  <Paragraph type="productDescription2">
                    {spec.name}
                  </Paragraph>
                  <SpecValue value={spec.value} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-[8px]">
  <Button
    variant="dark"
    className="group gap-[8px] !min-w-[216px] !h-[48px]"
  >
    {viewMoreLabel}
    <UpArrow className="transition-colors duration-300" />
  </Button>
</div>
    </section>
  );
}
