import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';

export function useProgressQuery() {
  const onlyTopicsWithReels = useAppStore((s) => s.onlyTopicsWithReels);
  return useQuery({
    queryKey: [...queryKeys.progress(), onlyTopicsWithReels],
    queryFn: () => educationApi.getProgress(),
  });
}
