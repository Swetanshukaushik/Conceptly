import { useQuery } from '@tanstack/react-query';

import { educationApi } from '@/services/api/educationApi';
import { educationQueryKeys } from '@/services/api/queryKeys';
import type { SubjectId } from '@/types/ids';
import type { Chapter } from '@/types/education';

export function useChaptersBySubjectQuery(args: {
  classLevelId: number | null;
  subjectId: SubjectId | null;
}) {
  return useQuery<Chapter[]>({
    queryKey:
      args.classLevelId == null || args.subjectId == null
        ? (['education', 'chapters', 'disabled'] as const)
        : educationQueryKeys.chaptersBySubject(
            args.classLevelId,
            args.subjectId
          ),
    queryFn: () => {
      if (args.classLevelId == null || args.subjectId == null) {
        return Promise.resolve([]);
      }
      return educationApi.getChaptersBySubject(args.classLevelId, args.subjectId);
    },
    enabled: args.classLevelId != null && args.subjectId != null
  });
}

