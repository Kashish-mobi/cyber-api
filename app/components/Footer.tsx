import Link from "next/link";
import homepage from "@/data/homepage.json";
import { CompanyLogoLight } from "../icons";
import { getIcon, type IconName } from "@/lib/icons";
import Heading from "./ui/Heading";
import Paragraph from "./ui/Paragraph";

const { footer } = homepage;

export default function Footer() {
  return (
    <footer className="flex items-center justify-center bg-primary text-secondary">
      <div className="container px-6 md:py-[72px] pb-[46px] pt-[48px] lg:px-0 2xl:pt-[104px] 2xl:pb-[144px]">
        <div className="grid grid-cols-1 md:gap-12 gap-8 md:grid-cols-[384px_1fr] md:gap-[113px]">
          <div className="flex flex-col items-center md:items-start">
            <CompanyLogoLight />

            <Paragraph type="footerleft" className="md:mt-[24px] mt-[15px] max-w-[384px] text-muted-footer">
              {footer.description}
            </Paragraph>

            <div className="mt-auto flex items-center gap-[36.33px] pt-16 2xl:pt-[184px] hidden md:flex">
              {footer.social.map((item) => {
                const Icon = getIcon(item.icon as IconName);
                return (
                  <Link key={item.label} href={item.href} aria-label={item.label}>
                    {Icon ? <Icon /> : null}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 justify-center gap-[32px] text-center md:grid-cols-[1fr_1fr] md:text-left">
            {footer.columns.map((column) => (
              <div key={column.title}>
                <Heading as="h3" variant="footer" className="mb-[8px]">
                  {column.title}
                </Heading>
                <ul className="space-y-[8px]">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>
                        <Paragraph
                          as="span"
                          type="footer"
                          className="text-muted-footer transition-colors hover:text-secondary"
                        >
                          {link.label}
                        </Paragraph>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-auto flex items-center justify-center gap-[26.33px]  md:hidden 2xl:pt-[184px]">
              {footer.social.map((item) => {
                const Icon = getIcon(item.icon as IconName);
                return (
                  <Link key={item.label} href={item.href} aria-label={item.label}>
                    <span className="inline-flex h-[24px] w-[24px] items-center justify-center [&_svg]:h-full [&_svg]:w-full">
                      {Icon ? <Icon /> : null}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
         
        </div>
      </div>
    </footer>
  );
}
