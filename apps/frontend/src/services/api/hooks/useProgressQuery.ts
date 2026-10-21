import { useQuery } from '@tanstack/react-query';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';

export function useProgressQuery() {
  return useQuery({
    queryKey: queryKeys.progress(),
    queryFn: () => educationApi.getProgress()
  });
}
