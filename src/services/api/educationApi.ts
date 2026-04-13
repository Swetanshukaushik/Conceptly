import type { Chapter, ClassLevel, Subject, Topic } from '@/types/education';
import type { Reel } from '@/types/reels';
import type { QuizQuestion } from '@/types/quiz';

import type { TopicProgress } from '@/types/progress';

import type { HomeFeed } from '@/types/feed';
import type { ReelId, TopicId } from '@/types/ids';

import { useMockData } from '@/constants/runtimeConfig';

import { mockEducationApi } from './mockEducationApi';
import { educationBackendApi } from './backend/educationBackendApi';

export type EducationApi = {
  getClassLevels(): Promise<ClassLevel[]>;
  getSubjectsByClassLevel(classLevelId: number): Promise<Subject[]>;

  getTopicById(topicId: string): Promise<Topic>;
  getChapterById(chapterId: string): Promise<Chapter>;

  // Future phases
  getChaptersBySubject(classLevelId: number, subjectId: string): Promise<Chapter[]>;
  getTopicsByChapter(chapterId: string): Promise<Topic[]>;
  getReelsByTopic(topicId: string): Promise<Reel[]>;
  getReelsByIds(reelIds: ReelId[]): Promise<Reel[]>;
  getReelById(reelId: ReelId): Promise<Reel>;
  getQuizQuestionsByReel(reelId: string): Promise<QuizQuestion[]>;
  getTopicProgress(topicId: string): Promise<TopicProgress>;
  getTopicProgressByTopicIds(topicIds: TopicId[]): Promise<TopicProgress[]>;

  // Home/feed aggregation for the MVP.
  getHomeFeedForSubject(args: {
    classLevelId: number;
    subjectId: string;
  }): Promise<HomeFeed>;
};

export const educationApi: EducationApi = useMockData
  ? mockEducationApi
  : educationBackendApi;

