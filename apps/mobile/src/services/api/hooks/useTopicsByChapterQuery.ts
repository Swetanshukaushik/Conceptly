import { useQuery } from '@tanstack/react-query';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';

export function useTopicsByChapterQuery(chapterId: string) {
  return useQuery({
    queryKey: queryKeys.topicsByChapter(chapterId),
    queryFn: () => educationApi.getTopicsByChapter(chapterId)
  });
}
