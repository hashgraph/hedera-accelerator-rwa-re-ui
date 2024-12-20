type Props = {
  params: Promise<{ id: string }>;
};
  
  export default async function StakingPage({ params }: Props) {
    const { id } = await params;
    return <div>Staking Page for building: {id}</div>;
}
  