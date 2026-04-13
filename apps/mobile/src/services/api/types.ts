export type ClassLevelDto = {
  id: number;
  label: { en: string; hi: string };
};

export type SubjectDto = {
  id: string;
  label: { en: string; hi: string };
};

export type ChapterDto = {
  id: string;
  subjectId: string;
  title: { en: string; hi: string };
};

export type TopicDto = {
  id: string;
  title: string;
  difficulty: string;
  chapterId: string;
  reelCount: number;
};

export type TopicDetailDto = {
  id: string;
  title: string;
  difficulty: string;
  chapterId: string;
  reelCount: number;
  chapter: { id: string; title: string };
  subject: { id: string; name: string; classLevel: number };
};

export type ReelDto = {
  id: string;
  title: string;
  videoUrl: string;
  durationSec?: number;
  duration?: string;
  topicId: string;
  topic: { id: string; title: string; difficulty: string };
  chapter: { id: string; title: string };
  subject: { id: string; name: string; classLevel: number };
};

export type QuizOptionDto = {
  id: string;
  text: string;
};

export type QuizQuestionDto = {
  id: string;
  text: string;
  options: QuizOptionDto[];
  correctOptionId: string;
  topicId: string;
};

export type QuizDto = {
  topicId: string;
  topicTitle: string;
  questions: QuizQuestionDto[];
};

export type TopicProgressDto = {
  id: string;
  topicId: string;
  completionPercent: number;
  createdAt: Date;
  updatedAt: Date;
  topic: { id: string; title: string; difficulty: string };
  chapter: { id: string; title: string };
  subject: { id: string; name: string; classLevel: number };
};

export type BookmarkDto = {
  id: string;
  topicId: string;
  reelId: string | null;
  createdAt: Date;
  topic: { id: string; title: string; difficulty: string };
  chapter: { id: string; title: string };
  subject: { id: string; name: string; classLevel: number };
};

export type HomeFeedDto = {
  subjectShortcuts: Array<{ id: string; name: string; classLevel: number }>;
  continueLearning: TopicDetailDto[];
  recommended: TopicDetailDto[];
  quickRevision: TopicDetailDto[];
};

