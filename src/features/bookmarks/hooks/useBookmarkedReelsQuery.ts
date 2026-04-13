import { useQuery } from '@tanstack/react-query';

import { educationApi } from '@/services/api/educationApi';
import type { ReelId } from '@/types/ids';
import { educationQueryKeys } from '@/services/api/queryKeys';

export function useBookmarkedReelsQuery(reelIds: ReelId[]) {
  return useQuery({
    queryKey: educationQueryKeys.reelsByIds(reelIds),
    queryFn: () => educationApi.getReelsByIds(reelIds),
    enabled: reelIds.length > 0
  });
}

