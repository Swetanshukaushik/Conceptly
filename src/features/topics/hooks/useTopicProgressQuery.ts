import { useQuery } from '@tanstack/react-query';

import { educationApi } from '@/services/api/educationApi';
import { educationQueryKeys } from '@/services/api/queryKeys';
import type { TopicProgress } from '@/types/progress';

export function useTopicProgressQuery(topicId: string | undefined) {
  return useQuery<TopicProgress>({
    queryKey: topicId
      ? (['education', 'topicProgress', topicId] as const)
      : (['education', 'topicProgress', 'disabled'] as const),
    queryFn: () => {
      if (!topicId) return Promise.reject(new Error('Missing topicId'));
      return educationApi.getTopicProgress(topicId);
    },
    enabled: !!topicId
  });
}

