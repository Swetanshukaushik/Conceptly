import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';

export function useHomeFeedQuery(examType?: string, classLevel?: number) {
  const onlyTopicsWithReels = useAppStore((s) => s.onlyTopicsWithReels);
  return useQuery({
    queryKey: [...queryKeys.homeFeed(examType, classLevel), onlyTopicsWithReels],
    queryFn: () => educationApi.getHomeFeed(examType, classLevel),
  });
}
