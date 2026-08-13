import Link from "next/link";
import { BreadCrumbs as BreadCrumbsIcon } from "../icons";
import { UpperCaseFirstLetter } from "@/lib/helper";

export type BreadCrumbsProps = {
  items: {
    label: string;
    href?: string;
  }[];
};

export default function BreadCrumbs({ items }: BreadCrumbsProps) {
  return (
    <div className="items-center gap-[17px] h-[104px] hidden lg:flex">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const content = (
          <>
            {UpperCaseFirstLetter(item.label)} {!isLast && <BreadCrumbsIcon />}
          </>
        );

        if (!item.href || isLast) {
          return (
            <span
              key={`${item.label}-${index}`}
              className={`flex items-center gap-[16px] tracking-[0.1px] ${isLast ? "text-primary" : "text-muted"}`}
            >
              {UpperCaseFirstLetter(item.label)}
            </span>
          );
        }

        return (
          <Link
            key={`${item.label}-${index}`}
            href={item.href}
            className="flex items-center gap-[16px] tracking-[0.1px] text-muted"
          >
              {content}
          </Link>
        );
      })}
    </div>
  );
}
