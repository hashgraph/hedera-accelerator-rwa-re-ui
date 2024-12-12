import { SliceDetailPage } from "@/components/Slices";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { slug } = params; 
  return <>{await SliceDetailPage({ sliceName: slug })}</>;
}