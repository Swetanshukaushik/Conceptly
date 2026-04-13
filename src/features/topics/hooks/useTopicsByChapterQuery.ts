import { useQuery } from '@tanstack/react-query';

import { educationApi } from '@/services/api/educationApi';
import { educationQueryKeys } from '@/services/api/queryKeys';
import type { Topic } from '@/types/education';

export function useTopicsByChapterQuery(chapterId: string | undefined) {
  return useQuery<Topic[]>({
    queryKey: chapterId
      ? educationQueryKeys.topicsByChapter(chapterId)
      : (['education', 'topics', 'disabled'] as const),
    queryFn: () => {
      if (!chapterId) return Promise.resolve([]);
      return educationApi.getTopicsByChapter(chapterId);
    },
    enabled: !!chapterId
  });
}

