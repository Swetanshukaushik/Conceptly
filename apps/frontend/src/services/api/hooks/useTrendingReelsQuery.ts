import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';
import type { TrendingReelsQueryDto } from '../types';

export function useTrendingReelsQuery(query?: TrendingReelsQueryDto) {
  const onlyTopicsWithReels = useAppStore((s) => s.onlyTopicsWithReels);
  const sortBy = query?.sortBy ?? 'trending';
  const timeWindow = query?.timeWindow ?? '24h';
  const examType = query?.examType;

  return useQuery({
    queryKey: [...queryKeys.trendingReels(sortBy, timeWindow, examType), onlyTopicsWithReels],
    queryFn: () => educationApi.getTrendingReels({ ...query, sortBy, timeWindow }),
  });
}
