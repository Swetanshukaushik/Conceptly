import { useQuery } from '@tanstack/react-query';

import { educationApi } from '@/services/api/educationApi';
import { educationQueryKeys } from '@/services/api/queryKeys';
import type { Reel } from '@/types/reels';

export function useReelsByTopicQuery(topicId: string | undefined) {
  return useQuery<Reel[]>({
    queryKey: topicId
      ? educationQueryKeys.reelsByTopic(topicId)
      : (['education', 'reels', 'disabled'] as const),
    queryFn: () => {
      if (!topicId) return Promise.resolve([]);
      return educationApi.getReelsByTopic(topicId);
    },
    enabled: !!topicId
  });
}

