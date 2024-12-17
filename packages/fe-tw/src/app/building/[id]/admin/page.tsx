type Props = {
  params: { id: string };
};

export default function AdminPage({ params }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Admin</h2>
      <p>Admin actions for building {params.id}:</p>
    </div>
  );
}
