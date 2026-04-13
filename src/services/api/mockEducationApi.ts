import type { EducationApi } from './educationApi';

import { delay } from '@/utils/delay';

import { educationMockDb } from '@/services/mockData/mvp/educationDb';
import type { ClassLevelId, ReelId, SubjectId, TopicId } from '@/types/ids';
import { getHomeFeedForSubjectMock } from '@/services/mockData/mvp/homeFeedMockData';

const NETWORK_DELAY_MS = 250;

export const mockEducationApi: EducationApi = {
  async getClassLevels() {
    await delay(NETWORK_DELAY_MS);
    return educationMockDb.classLevels;
  },

  async getSubjectsByClassLevel(classLevelId) {
    await delay(NETWORK_DELAY_MS);
    return educationMockDb.subjectsByClass[classLevelId] ?? [];
  },

  async getChapterById(chapterId) {
    await delay(NETWORK_DELAY_MS);
    const chapter = educationMockDb.chapters.find((c) => c.id === chapterId);
    if (!chapter) throw new Error('Chapter not found');
    return chapter;
  },

  async getTopicById(topicId) {
    await delay(NETWORK_DELAY_MS);
    const topic = educationMockDb.topics.find((t) => t.id === topicId);
    if (!topic) throw new Error('Topic not found');
    return topic;
  },

  async getChaptersBySubject(classLevelId, subjectId) {
    await delay(NETWORK_DELAY_MS);
    return educationMockDb.chapters
      .filter((c) => c.classLevelId === classLevelId && c.subjectId === subjectId)
      .sort((a, b) => a.order - b.order);
  },

  async getTopicsByChapter(chapterId) {
    await delay(NETWORK_DELAY_MS);
    return educationMockDb.topics
      .filter((t) => t.chapterId === chapterId)
      .sort((a, b) => a.order - b.order);
  },

  async getReelsByTopic(topicId) {
    await delay(NETWORK_DELAY_MS);
    return educationMockDb.reels
      .filter((r) => r.topicId === topicId)
      .sort((a, b) => a.order - b.order);
  },

  async getReelsByIds(reelIds: ReelId[]) {
    await delay(NETWORK_DELAY_MS);
    const set = new Set(reelIds);
    return educationMockDb.reels.filter((r) => set.has(r.id));
  },

  async getReelById(reelId: ReelId) {
    await delay(NETWORK_DELAY_MS);
    const reel = educationMockDb.reels.find((r) => r.id === reelId);
    if (!reel) throw new Error('Reel not found');
    return reel;
  },

  async getQuizQuestionsByReel(reelId) {
    await delay(NETWORK_DELAY_MS);
    return educationMockDb.quizQuestionsByReel[reelId] ?? [];
  },

  async getTopicProgress(topicId) {
    await delay(NETWORK_DELAY_MS);
    return educationMockDb.topicProgressByTopicId[topicId];
  },

  async getTopicProgressByTopicIds(topicIds: TopicId[]) {
    await delay(NETWORK_DELAY_MS);
    return topicIds
      .map((id) => educationMockDb.topicProgressByTopicId[id])
      .filter(Boolean);
  },

  async getHomeFeedForSubject({ classLevelId, subjectId }) {
    await delay(NETWORK_DELAY_MS);
    return getHomeFeedForSubjectMock({ classLevelId, subjectId });
  }
};

