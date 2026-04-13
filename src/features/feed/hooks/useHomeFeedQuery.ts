import { useQuery } from '@tanstack/react-query';

import type { SubjectId } from '@/types/ids';
import { educationApi } from '@/services/api/educationApi';
import { educationQueryKeys } from '@/services/api/queryKeys';

export function useHomeFeedQuery(args: {
  classLevelId: number | null;
  subjectId: SubjectId | null;
}) {
  return useQuery({
    queryKey:
      args.classLevelId == null || args.subjectId == null
        ? (['education', 'homeFeed', 'disabled'] as const)
        : educationQueryKeys.homeFeedForSubject(
            args.classLevelId,
            args.subjectId
          ),
    queryFn: () => {
      if (args.classLevelId == null || args.subjectId == null) {
        return Promise.resolve({
          classLevelId: null,
          subjectId: null,
          sections: []
        });
      }
      return educationApi.getHomeFeedForSubject({
        classLevelId: args.classLevelId,
        subjectId: args.subjectId
      });
    },
    enabled: args.classLevelId != null && args.subjectId != null
  });
}

