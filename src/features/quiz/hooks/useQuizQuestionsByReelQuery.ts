import { useQuery } from '@tanstack/react-query';

import { educationApi } from '@/services/api/educationApi';

export function useQuizQuestionsByReelQuery(reelId: string | undefined) {
  return useQuery({
    queryKey: reelId
      ? (['education', 'quizQuestions', reelId] as const)
      : (['education', 'quizQuestions', 'disabled'] as const),
    queryFn: () => {
      if (!reelId) return Promise.resolve([]);
      return educationApi.getQuizQuestionsByReel(reelId);
    },
    enabled: !!reelId
  });
}

