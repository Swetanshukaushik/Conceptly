import { useQuery } from '@tanstack/react-query';

import { educationApi } from '@/services/api/educationApi';
import { educationQueryKeys } from '@/services/api/queryKeys';
import type { Chapter } from '@/types/education';

export function useChapterByIdQuery(chapterId: string | undefined) {
  return useQuery<Chapter>({
    queryKey: chapterId
      ? educationQueryKeys.chapterById(chapterId)
      : (['education', 'chapter', 'disabled'] as const),
    queryFn: () => {
      if (!chapterId) return Promise.reject(new Error('Missing chapterId'));
      return educationApi.getChapterById(chapterId);
    },
    enabled: !!chapterId
  });
}

