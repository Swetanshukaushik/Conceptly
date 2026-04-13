import { useQuery } from '@tanstack/react-query';

import { educationQueryKeys } from '@/services/api/queryKeys';
import { educationApi } from '@/services/api/educationApi';

export function useClassLevelsQuery() {
  return useQuery({
    queryKey: educationQueryKeys.classes(),
    queryFn: () => educationApi.getClassLevels()
  });
}

