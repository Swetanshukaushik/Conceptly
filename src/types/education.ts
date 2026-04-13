import type { ChapterId, ClassLevelId, SubjectId, TopicId } from './ids';
import type { LocalizedString } from './i18n';

export type ClassLevel = {
  id: ClassLevelId;
  label: LocalizedString;
};

export type Subject = {
  id: SubjectId;
  label: LocalizedString;
  shortLabel: LocalizedString;
};

export type Chapter = {
  id: ChapterId;
  classLevelId: ClassLevelId;
  subjectId: SubjectId;
  title: LocalizedString;
  order: number;
};

export type Topic = {
  id: TopicId;
  chapterId: ChapterId;
  title: LocalizedString;
  estimatedReelCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
};

