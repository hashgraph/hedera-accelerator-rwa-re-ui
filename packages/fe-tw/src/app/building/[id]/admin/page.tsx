type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminPage({ params }: Props) {
  const { id } = await params; 
  return <div>Admin Page for Building {id}</div>;
}