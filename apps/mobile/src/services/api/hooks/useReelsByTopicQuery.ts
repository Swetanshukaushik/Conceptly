import { useQuery } from '@tanstack/react-query';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';

export function useReelsByTopicQuery(topicId: string) {
  return useQuery({
    queryKey: queryKeys.reelsByTopic(topicId),
    queryFn: () => educationApi.getReelsByTopic(topicId)
  });
}
