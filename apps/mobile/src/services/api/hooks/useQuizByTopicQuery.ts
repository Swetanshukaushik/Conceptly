import { useQuery } from '@tanstack/react-query';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';

export function useQuizByTopicQuery(topicId: string) {
  return useQuery({
    queryKey: queryKeys.quizByTopic(topicId),
    queryFn: () => educationApi.getQuizByTopic(topicId)
  });
}
