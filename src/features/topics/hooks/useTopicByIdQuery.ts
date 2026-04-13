import { useQuery } from '@tanstack/react-query';

import { educationApi } from '@/services/api/educationApi';
import { educationQueryKeys } from '@/services/api/queryKeys';
import type { Topic } from '@/types/education';

export function useTopicByIdQuery(topicId: string | undefined) {
  return useQuery<Topic>({
    queryKey: topicId
      ? educationQueryKeys.topicById(topicId)
      : (['education', 'topic', 'disabled'] as const),
    queryFn: () => {
      if (!topicId) return Promise.reject(new Error('Missing topicId'));
      return educationApi.getTopicById(topicId);
    },
    enabled: !!topicId
  });
}

