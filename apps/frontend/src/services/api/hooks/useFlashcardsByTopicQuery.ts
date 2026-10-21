import { useQuery } from '@tanstack/react-query';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';
import type { FlashcardDto } from '../types';

export function useFlashcardsByTopicQuery(topicId: string) {
  return useQuery<FlashcardDto[]>({
    queryKey: queryKeys.flashcardsByTopic(topicId),
    queryFn: () => educationApi.getFlashcardsByTopic(topicId),
    enabled: Boolean(topicId),
  });
}
