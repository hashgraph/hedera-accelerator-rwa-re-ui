import { use } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function SlicesPage({ params }: Props) {
  const { id } = use(params); 
  return <div>Slices Page for building: {id}</div>;
}