import type { TopicId, ReelId } from './ids';

export type TopicProgress = {
  topicId: TopicId;
  // 0..100
  completionPercent: number;
  // For "continue where you left off"
  lastReelId: ReelId | null;
  completedReelIds: ReelId[];
};

