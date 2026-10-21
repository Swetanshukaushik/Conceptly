import { useQuery } from '@tanstack/react-query';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';

export function useBookmarksQuery() {
  return useQuery({
    queryKey: queryKeys.bookmarks(),
    queryFn: () => educationApi.getBookmarks()
  });
}
