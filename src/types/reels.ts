import type { ReelId, TopicId } from './ids';
import type { LocalizedString } from './i18n';
import type { ClassLevelId, SubjectId } from './ids';

export type ReelScene = {
  id: string;
  // Small caption shown at this scene.
  caption: LocalizedString;
  // Placeholder timestamps in seconds.
  startSec: number;
  endSec: number;
};

export type Reel = {
  id: ReelId;
  topicId: TopicId;
  classLevelId: ClassLevelId;
  subjectId: SubjectId;
  order: number;

  title: LocalizedString;
  subtitle?: LocalizedString;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedSeconds: number;

  videoUrl: string;
  thumbnailUrl: string;
  scenes: ReelScene[];
};

