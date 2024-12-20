type Props = {
  params: Promise<{ id: string }>;
};

export default async function SlicesPage({ params }: Props) {
  const { id } = await params;
  return <div>Slices Page for building: {id}</div>;
}