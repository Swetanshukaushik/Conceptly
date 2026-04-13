import { runtimeConfig } from '@/constants/runtimeConfig';
import { apiGet, apiPost, apiDelete } from './client';
import { mockChaptersBySubject, mockClasses, mockSubjectsByClass, mockReels, mockTopics, mockTopicDetails, mockHomeFeed, mockQuizzes } from './mockData';
import type {
  ChapterDto,
  ClassLevelDto,
  SubjectDto,
  TopicDto,
  TopicDetailDto,
  ReelDto,
  QuizDto,
  TopicProgressDto,
  BookmarkDto,
  HomeFeedDto
} from './types';

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function mapClassLevelResponse(item: { classLevel: number }): ClassLevelDto {
  const label = `Class ${item.classLevel}`;
  return {
    id: item.classLevel,
    label: {
      en: label,
      hi: `कक्षा ${item.classLevel}`
    }
  };
}

function mapSubjectResponse(item: { id: string; name: string }): SubjectDto {
  return {
    id: item.id,
    label: {
      en: item.name,
      hi: item.name
    }
  };
}

function mapChapterResponse(item: { id: string; subjectId: string; title: string }): ChapterDto {
  return {
    id: item.id,
    subjectId: item.subjectId,
    title: {
      en: item.title,
      hi: item.title
    }
  };
}

export const educationApi = {
  async getExamTypes(): Promise<Array<{ examType: string; label: string }>> {
    if (runtimeConfig.useMockData) {
      await sleep(180);
      return [
        { examType: 'SCHOOL', label: 'School Curriculum' },
        { examType: 'UPSC', label: 'UPSC Preparation' },
        { examType: 'IIT_JEE', label: 'IIT JEE Preparation' },
        { examType: 'NEET', label: 'NEET Preparation' }
      ];
    }

    return apiGet<Array<{ examType: string; label: string }>>('/v1/curriculum/exam-types');
  },

  async getClasses(): Promise<ClassLevelDto[]> {
    if (runtimeConfig.useMockData) {
      await sleep(180);
      return mockClasses;
    }

    const response = await apiGet<Array<{ classLevel: number }>>('/v1/curriculum/classes');
    return response.map(mapClassLevelResponse);
  },

  async getSubjectsByClass(classId: number): Promise<SubjectDto[]> {
    if (runtimeConfig.useMockData) {
      await sleep(180);
      return mockSubjectsByClass[classId] ?? [];
    }

    const response = await apiGet<Array<{ id: string; name: string }>>(
      `/v1/curriculum/classes/${classId}/subjects`
    );
    return response.map(mapSubjectResponse);
  },

  async getSubjectsByExamType(examType: string): Promise<SubjectDto[]> {
    if (runtimeConfig.useMockData) {
      await sleep(180);
      // Mock subjects for different exam types
      const mockSubjects: Record<string, SubjectDto[]> = {
        UPSC: [
          { id: 'upsc-polity', label: { en: 'Polity', hi: 'राजनीति' } },
          { id: 'upsc-history', label: { en: 'History', hi: 'इतिहास' } },
          { id: 'upsc-geography', label: { en: 'Geography', hi: 'भूगोल' } }
        ],
        IIT_JEE: [
          { id: 'jee-physics', label: { en: 'Physics', hi: 'भौतिकी' } },
          { id: 'jee-chemistry', label: { en: 'Chemistry', hi: 'रसायन विज्ञान' } },
          { id: 'jee-mathematics', label: { en: 'Mathematics', hi: 'गणित' } }
        ],
        NEET: [
          { id: 'neet-physics', label: { en: 'Physics', hi: 'भौतिकी' } },
          { id: 'neet-chemistry', label: { en: 'Chemistry', hi: 'रसायन विज्ञान' } },
          { id: 'neet-biology', label: { en: 'Biology', hi: 'जीव विज्ञान' } }
        ]
      };
      return mockSubjects[examType] ?? [];
    }

    const response = await apiGet<Array<{ id: string; name: string }>>(
      `/v1/curriculum/exam-types/${examType}/subjects`
    );
    return response.map(mapSubjectResponse);
  },

  async getChaptersBySubject(subjectId: string): Promise<ChapterDto[]> {
    if (runtimeConfig.useMockData) {
      await sleep(180);
      return mockChaptersBySubject[subjectId] ?? [];
    }

    const response = await apiGet<Array<{ id: string; subjectId: string; title: string }>>(
      `/v1/curriculum/subjects/${subjectId}/chapters`
    );
    return response.map(mapChapterResponse);
  },

  async getTopicsByChapter(chapterId: string): Promise<TopicDto[]> {
    if (runtimeConfig.useMockData) {
      await sleep(200);
      return mockTopics.filter(topic => topic.chapterId === chapterId);
    }

    return apiGet<TopicDto[]>(`/v1/curriculum/chapters/${chapterId}/topics`);
  },

  async getTopicById(topicId: string): Promise<TopicDetailDto> {
    if (runtimeConfig.useMockData) {
      await sleep(200);
      const topic = mockTopicDetails.find(t => t.id === topicId);
      if (!topic) {
        throw new Error(`Topic not found: ${topicId}`);
      }
      return topic;
    }

    return apiGet<TopicDetailDto>(`/v1/curriculum/topics/${topicId}`);
  },

  async getReelsByTopic(topicId: string): Promise<ReelDto[]> {
    if (runtimeConfig.useMockData) {
      await sleep(300);
      return mockReels.filter(reel => reel.topicId === topicId);
    }

    return apiGet<ReelDto[]>(`/v1/topics/${topicId}/reels`);
  },

  async getReelById(reelId: string): Promise<ReelDto> {
    if (runtimeConfig.useMockData) {
      await sleep(200);
      const reel = mockReels.find(r => r.id === reelId);
      if (!reel) {
        throw new Error(`Reel not found: ${reelId}`);
      }
      return reel;
    }

    return apiGet<ReelDto>(`/v1/reels/${reelId}`);
  },

  async getQuizByTopic(topicId: string): Promise<QuizDto> {
    if (runtimeConfig.useMockData) {
      await sleep(300);
      const quiz = mockQuizzes[topicId];
      if (!quiz) {
        throw new Error(`Quiz not found for topic: ${topicId}`);
      }
      return quiz;
    }

    return apiGet<QuizDto>(`/v1/topics/${topicId}/quiz`);
  },

  async getHomeFeed(examType?: string, classLevel?: number): Promise<HomeFeedDto> {
    if (runtimeConfig.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockHomeFeed;
    }

    const params = new URLSearchParams();
    if (examType) params.append('examType', examType);
    if (classLevel) params.append('classLevel', classLevel.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiGet<HomeFeedDto>(`/v1/feed/home${query}`);
  },

  async getProgress(): Promise<TopicProgressDto[]> {
    if (runtimeConfig.useMockData) {
      await sleep(200);
      // Return empty array for mock progress
      return [];
    }

    return apiGet<TopicProgressDto[]>('/v1/progress');
  },

  async updateProgress(topicId: string, completionPercent: number): Promise<TopicProgressDto> {
    if (runtimeConfig.useMockData) {
      await sleep(200);
      // Return mock progress object
      return {
        id: `progress-${topicId}`,
        topicId,
        completionPercent,
        createdAt: new Date()
      };
    }

    return apiPost<TopicProgressDto>('/v1/progress', {
      topicId,
      completionPercent
    });
  },

  async getBookmarks(): Promise<BookmarkDto[]> {
    if (runtimeConfig.useMockData) {
      await sleep(200);
      // Return empty array for mock bookmarks
      return [];
    }

    return apiGet<BookmarkDto[]>('/v1/bookmarks');
  },

  async createBookmark(topicId: string, reelId?: string): Promise<BookmarkDto> {
    if (runtimeConfig.useMockData) {
      await sleep(200);
      // Return mock bookmark object
      return {
        id: `bookmark-${topicId}-${reelId || 'topic'}`,
        topicId,
        reelId,
        createdAt: new Date()
      };
    }

    return apiPost<BookmarkDto>('/v1/bookmarks', {
      topicId,
      reelId
    });
  },

  async deleteBookmark(bookmarkId: string): Promise<void> {
    if (runtimeConfig.useMockData) {
      await sleep(200);
      // Mock successful deletion
      return;
    }

    return apiDelete(`/v1/bookmarks/${bookmarkId}`);
  },

  async trackAnalyticsEvent(eventName: string, payload?: Record<string, any>): Promise<void> {
    return apiPost('/v1/analytics/events', {
      eventName,
      payload
    });
  }
};

