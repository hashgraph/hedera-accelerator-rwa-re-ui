import { useQuery } from '@tanstack/react-query';
import { getSliceTokensData } from '@/services/sliceService';

export function useSliceData(sliceName: string) {
  return useQuery({
    queryKey: ['sliceData', sliceName],
    queryFn: () => getSliceTokensData(sliceName),
  });
}
