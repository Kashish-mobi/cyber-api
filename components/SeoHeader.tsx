

type SeoHeaderProps = {
  title: string;
  description: string;
};

export default function SeoHeader({ title, description }: SeoHeaderProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  )
}