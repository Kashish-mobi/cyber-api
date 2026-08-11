import AppImage from "@/app/components/ui/Image";
import Button from "@/app/components/ui/Button";
import Heading from "@/app/components/ui/Heading";
import Paragraph from "@/app/components/ui/Paragraph";

type ComingSoonProps = {
  title: string;
  description: string;
};

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex flex-1 items-center justify-center bg-white px-[16px] py-[48px]">
        <div className="flex w-full max-w-[560px] flex-col items-center text-center">
          <AppImage
            src="/website/commingsoon.png"
            alt="Coming soon"
            width={320}
            height={320}
            className="mb-[32px] h-auto w-full max-w-[280px] object-contain"
            priority
          />

          <Heading as="h1" variant="section">
            {title}
          </Heading>

          <Paragraph className="mt-[12px] text-muted">{description}</Paragraph>

          <Paragraph className="mt-[8px] text-muted">
            This page is coming soon. We&apos;re working on it.
          </Paragraph>

          <Button
            href="/"
            variant="dark"
            text="Back to Home"
            className="mt-[32px]"
          />
        </div>
      </main>

    </div>
  );
}
