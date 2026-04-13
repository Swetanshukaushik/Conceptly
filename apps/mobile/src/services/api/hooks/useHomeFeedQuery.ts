import { useQuery } from '@tanstack/react-query';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';

export function useHomeFeedQuery(examType?: string, classLevel?: number) {
  return useQuery({
    queryKey: queryKeys.homeFeed(examType, classLevel),
    queryFn: () => educationApi.getHomeFeed(examType, classLevel)
  });
}
