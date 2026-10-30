import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { educationApi } from '../educationApi';
import { queryKeys } from '../queryKeys';

export function useBookmarksQuery() {
  const onlyTopicsWithReels = useAppStore((s) => s.onlyTopicsWithReels);
  return useQuery({
    queryKey: [...queryKeys.bookmarks(), onlyTopicsWithReels],
    queryFn: () => educationApi.getBookmarks(),
  });
}
