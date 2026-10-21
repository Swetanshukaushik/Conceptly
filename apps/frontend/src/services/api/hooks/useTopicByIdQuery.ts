import { useQuery } from '@tanstack/react-query';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';

export function useTopicByIdQuery(topicId: string) {
  return useQuery({
    queryKey: queryKeys.topicById(topicId),
    queryFn: () => educationApi.getTopicById(topicId),
    enabled: !!topicId
  });
}
