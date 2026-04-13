import type { EducationApi } from '../educationApi';

import { apiBaseUrl } from '@/constants/runtimeConfig';

import type { ClassLevel, Subject, Chapter, Topic } from '@/types/education';
import type { Reel } from '@/types/reels';
import type { QuizQuestion } from '@/types/quiz';
import type { TopicProgress } from '@/types/progress';
import type { HomeFeed } from '@/types/feed';
import type { ReelId, TopicId } from '@/types/ids';

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error('API base URL is not configured (EXPO_PUBLIC_API_BASE_URL).');
  }

  const url = `${apiBaseUrl.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Request failed (${res.status}) for ${path}${text ? `: ${text}` : ''}`
    );
  }

  return (await res.json()) as T;
}

export const educationBackendApi: EducationApi = {
  getClassLevels() {
    return requestJson<ClassLevel[]>('/education/class-levels');
  },

  getSubjectsByClassLevel(classLevelId) {
    return requestJson<Subject[]>(
      `/education/class-levels/${classLevelId}/subjects`
    );
  },

  getChapterById(chapterId) {
    return requestJson<Chapter>(`/education/chapters/${chapterId}`);
  },

  getTopicById(topicId) {
    return requestJson<Topic>(`/education/topics/${topicId}`);
  },

  // Future phases
  getChaptersBySubject(classLevelId, subjectId) {
    return requestJson<Chapter[]>(
      `/education/class-levels/${classLevelId}/subjects/${subjectId}/chapters`
    );
  },

  getTopicsByChapter(chapterId) {
    return requestJson<Topic[]>(`/education/chapters/${chapterId}/topics`);
  },

  getReelsByTopic(topicId) {
    return requestJson<Reel[]>(`/education/topics/${topicId}/reels`);
  },

  getReelsByIds(reelIds: ReelId[]) {
    return requestJson<Reel[]>('/education/reels/batch', {
      method: 'POST',
      body: JSON.stringify({ reelIds })
    });
  },

  getReelById(reelId: ReelId) {
    return requestJson<Reel>(`/education/reels/${reelId}`);
  },

  getQuizQuestionsByReel(reelId) {
    return requestJson<QuizQuestion[]>(
      `/education/reels/${reelId}/quiz-questions`
    );
  },

  getTopicProgress(topicId) {
    return requestJson<TopicProgress>(`/education/topics/${topicId}/progress`);
  },

  getTopicProgressByTopicIds(topicIds: TopicId[]) {
    return requestJson<TopicProgress[]>('/education/topics/progress/batch', {
      method: 'POST',
      body: JSON.stringify({ topicIds })
    });
  },

  getHomeFeedForSubject({ classLevelId, subjectId }) {
    return requestJson<HomeFeed>(
      `/education/home-feed?classLevelId=${classLevelId}&subjectId=${encodeURIComponent(subjectId)}`
    );
  }
};

