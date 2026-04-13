import type { LocalizedString } from './i18n';
import type { QuizId, ReelId } from './ids';

export type QuizOption = {
  id: string;
  label: LocalizedString;
};

export type QuizQuestion = {
  id: string;
  quizId: QuizId;
  reelId: ReelId;
  prompt: LocalizedString;
  options: QuizOption[];
  correctOptionId: string;
  explanation?: LocalizedString;
};

