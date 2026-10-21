import { useQuery } from '@tanstack/react-query';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';

export function useChaptersBySubjectQuery(subjectId: string) {
  return useQuery({
    queryKey: queryKeys.chaptersBySubject(subjectId),
    queryFn: () => educationApi.getChaptersBySubject(subjectId),
    enabled: !!subjectId,
  });
}
