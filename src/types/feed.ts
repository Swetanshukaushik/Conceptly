import type { LocalizedString } from './i18n';
import type { ReelId, SubjectId, TopicId } from './ids';
import type { ClassLevelId } from './ids';
import type { Topic } from './education';
import type { Reel } from './reels';

export type FeedSectionId = 'continue' | 'recommended' | 'revision';

export type FeedItem = {
  id: string;
  subjectId: SubjectId;
  topicId: TopicId;
  reelId: ReelId;

  title: LocalizedString;
  subtitle?: LocalizedString;

  thumbnailUrl: string;
  estimatedSeconds: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

export type FeedSection = {
  id: FeedSectionId;
  title: LocalizedString;
  subtitle?: LocalizedString;
  items: FeedItem[];
};

export type HomeFeed = {
  classLevelId: ClassLevelId | null;
  subjectId: SubjectId | null;
  sections: FeedSection[];
};

export function toFeedItemFromReel(args: {
  reel: Reel;
  topic: Topic;
}): FeedItem {
  const { reel, topic } = args;
  return {
    id: reel.id,
    subjectId: reel.subjectId,
    topicId: topic.id,
    reelId: reel.id,
    title: reel.title,
    subtitle: reel.subtitle,
    thumbnailUrl: reel.thumbnailUrl,
    estimatedSeconds: reel.estimatedSeconds,
    difficulty: reel.difficulty
  };
}

