type Props = {
    params: { id: string };
  };
  
  export default function StakingPage({ params }: Props) {
    return <div>Staking Page for building: {params.id}</div>;
  }
  