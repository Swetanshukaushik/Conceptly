import { useQuery } from '@tanstack/react-query';

import { educationApi } from '@/services/api/educationApi';
import { educationQueryKeys } from '@/services/api/queryKeys';
import type { Topic } from '@/types/education';
import type { TopicProgress } from '@/types/progress';

export function useProgressForChapterQuery(chapterId: string | null) {
  return useQuery({
    queryKey: chapterId
      ? (['education', 'progressForChapter', chapterId] as const)
      : (['education', 'progressForChapter', 'disabled'] as const),
    queryFn: async (): Promise<{ topics: Topic[]; progress: TopicProgress[] }> => {
      if (!chapterId) return { topics: [], progress: [] };

      const topics = await educationApi.getTopicsByChapter(chapterId);
      const progress = await educationApi.getTopicProgressByTopicIds(
        topics.map((t) => t.id)
      );
      return { topics, progress };
    },
    enabled: !!chapterId
  });
}

