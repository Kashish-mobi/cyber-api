import ComingSoon from "@/app/components/ComingSoon";

const categoryTitles: Record<string, string> = {
  phones: "Phones",
  "smart-watches": "Smart Watches",
  cameras: "Cameras",
  headphones: "Headphones",
  computers: "Computers",
  gaming: "Gaming",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const title = categoryTitles[slug] ?? slug.replace(/-/g, " ");

  return (
    <ComingSoon
      title={title}
      description={`Explore our ${title.toLowerCase()} collection. Full listings are on the way.`}
    />
  );
}
