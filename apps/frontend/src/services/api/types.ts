export type ClassLevelDto = {
  id: number;
  label: { en: string; hi: string };
};

export type SubjectDto = {
  id: string;
  label: { en: string; hi: string };
  iconName?: string;
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
  cheatSheetSummary?: string[];
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
  keyTakeaway?: string;
  summaryNotes?: string[];
  architectureDiagram?: string;
  interviewPitch?: string;
  pitfalls?: string[];
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

export type QuizQuestionResultDto = {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  explanation: string;
};

export type QuizSubmissionResultDto = {
  topicId: string;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  passed: boolean;
  results: QuizQuestionResultDto[];
  progressUpdated: boolean;
};

export type ReelViewEventDto = {
  reelId: string;
  watchDurationSec: number;
  completed: boolean;
};

export type FlashcardDto = {
  id: string;
  topicId: string;
  frontQuestion: string;
  backAnswer: string;
  bullets?: string[];
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
