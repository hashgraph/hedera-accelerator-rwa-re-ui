import { SliceDetailPage } from "@/components/Slices";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params; 
  return <>{await SliceDetailPage({ sliceName: slug })}</>;
}