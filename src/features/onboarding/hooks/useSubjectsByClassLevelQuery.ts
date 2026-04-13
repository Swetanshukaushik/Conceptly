import { useQuery } from '@tanstack/react-query';

import { educationApi } from '@/services/api/educationApi';
import { educationQueryKeys } from '@/services/api/queryKeys';

export function useSubjectsByClassLevelQuery(classLevelId: number | null) {
  return useQuery({
    queryKey:
      classLevelId == null
        ? (['education', 'subjects', '_'] as const)
        : educationQueryKeys.subjectsByClass(classLevelId),
    queryFn: () => {
      if (classLevelId == null) return Promise.resolve([]);
      return educationApi.getSubjectsByClassLevel(classLevelId);
    },
    enabled: classLevelId != null
  });
}

