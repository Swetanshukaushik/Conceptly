import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';

export function useChaptersBySubjectQuery(subjectId: string) {
  const onlyTopicsWithReels = useAppStore((s) => s.onlyTopicsWithReels);
  return useQuery({
    queryKey: [...queryKeys.chaptersBySubject(subjectId), onlyTopicsWithReels],
    queryFn: () => educationApi.getChaptersBySubject(subjectId),
    enabled: !!subjectId,
  });
}
