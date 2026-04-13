import type { Chapter, Topic } from '@/types/education';
import type { Reel } from '@/types/reels';

export type ReelWithContext = {
  reel: Reel;
  topic: Topic;
  chapter?: Chapter;
};

