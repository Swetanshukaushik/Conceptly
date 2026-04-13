import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, type FlatListProps, type ListRenderItem } from 'react-native';
import { useWindowDimensions } from 'react-native';

export type VerticalReelPagerProps<TItem> = {
  items: TItem[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  renderItem: ListRenderItem<TItem>;
  keyExtractor?: (item: TItem, index: number) => string;
  setScrollToIndexHandler?: (handler: (index: number) => void) => void;
  // Optional: if true, each cell uses full height.
  fullHeight?: boolean;
};

export function VerticalReelPager<TItem>({
  items,
  initialIndex = 0,
  onIndexChange,
  renderItem,
  keyExtractor,
  setScrollToIndexHandler,
  fullHeight = true
}: VerticalReelPagerProps<TItem>) {
  const { height } = useWindowDimensions();
  const listRef = useRef<FlatList<TItem>>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const cellHeight = fullHeight ? height : undefined;

  const computedInitialIndex = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.min(Math.max(initialIndex, 0), items.length - 1);
  }, [initialIndex, items.length]);

  const handleMomentumScrollEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      const y = e.nativeEvent.contentOffset.y;
      const idx = cellHeight ? Math.round(y / cellHeight) : 0;
      const safeIdx = Math.min(Math.max(idx, 0), items.length - 1);
      setCurrentIndex(safeIdx);
      onIndexChange?.(safeIdx);
    },
    [cellHeight, items.length, onIndexChange]
  );

  const getItemLayout: FlatListProps<TItem>['getItemLayout'] = useCallback(
    (_data, index) => {
      const len = cellHeight ?? height;
      return { length: len, offset: len * index, index };
    },
    [cellHeight, height]
  );

  React.useEffect(() => {
    if (!setScrollToIndexHandler) return;
    setScrollToIndexHandler((index: number) => {
      listRef.current?.scrollToIndex({ index, animated: true });
    });
  }, [setScrollToIndexHandler]);

  return (
    <FlatList
      ref={listRef}
      data={items}
      keyExtractor={keyExtractor ?? ((_, idx) => String(idx))}
      renderItem={renderItem}
      pagingEnabled={fullHeight}
      snapToInterval={fullHeight ? height : undefined}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      initialScrollIndex={computedInitialIndex}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      getItemLayout={getItemLayout}
      scrollEventThrottle={16}
      // Prevent accidental scroll bounce from interfering with "reels" UX
      bounces={false}
      // Ensure FlatList doesn't render too much offscreen for video-heavy UX
      windowSize={3}
      maxToRenderPerBatch={2}
      initialNumToRender={1}
      removeClippedSubviews
    />
  );
}

