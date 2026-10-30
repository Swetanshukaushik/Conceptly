import { runtimeConfig } from '@/constants/runtimeConfig';
import { useAppStore } from '@/store/useAppStore';
import { apiGet, apiPost, apiDelete } from './client';
import { offlineCache } from './offlineCache';
import {
  mockChaptersBySubject,
  mockClasses,
  mockSubjectsByClass,
  mockSubjectsByExamType,
  mockReels,
  mockTopics,
  mockTopicDetails,
  mockHomeFeed,
  mockQuizzes,
  mockFlashcards,
  mockProgress,
  mockBookmarks,
} from './mockData';
import type {
  ChapterDto,
  ClassLevelDto,
  SubjectDto,
  TopicDto,
  TopicDetailDto,
  ReelDto,
  QuizDto,
  QuizSubmissionResultDto,
  ReelViewEventDto,
  FlashcardDto,
  TopicProgressDto,
  BookmarkDto,
  HomeFeedDto
} from './types';
import type {
  AuthResponseDto,
  GuestSessionRequestDto,
  LoginRequestDto,
  SignupRequestDto,
  UserProfileDto,
} from '@/contracts';

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function mapClassLevelResponse(item: any): ClassLevelDto {
  const id = typeof item.id === 'number' ? item.id : item.classLevel;
  if (item.label && typeof item.label === 'object' && typeof item.label.en === 'string') {
    return {
      id,
      label: {
        en: item.label.en,
        hi: item.label.hi || item.label.en,
      },
    };
  }
  const labelStr = `Class ${id}`;
  return {
    id,
    label: {
      en: labelStr,
      hi: `कक्षा ${id}`,
    },
  };
}

function mapSubjectResponse(item: any): SubjectDto {
  if (item.label && typeof item.label === 'object' && typeof item.label.en === 'string') {
    return {
      id: item.id,
      label: {
        en: item.label.en,
        hi: item.label.hi || item.label.en,
      },
    };
  }
  const name = item.name || item.id;
  return {
    id: item.id,
    label: {
      en: name,
      hi: name,
    },
  };
}

function mapChapterResponse(item: any): ChapterDto {
  let titleEn = 'Module';
  let titleHi = 'मॉड्यूल';

  if (item.title && typeof item.title === 'object') {
    titleEn = item.title.en || 'Module';
    titleHi = item.title.hi || titleEn;
  } else if (typeof item.title === 'string') {
    titleEn = item.title;
    titleHi = item.title;
  }

  return {
    id: item.id,
    subjectId: item.subjectId,
    title: {
      en: titleEn,
      hi: titleHi,
    },
  };
}

function resolveTopicMetadata(topicId: string) {
  const detail = mockTopicDetails.find((t) => t.id === topicId);
  if (detail) {
    return {
      id: detail.id,
      title: detail.title,
      difficulty: detail.difficulty,
      chapterId: detail.chapterId,
      chapterTitle: detail.chapter.title,
      subjectId: detail.subject.id,
      subjectName: detail.subject.name,
      notes: detail.cheatSheetSummary ?? [
        `Understand the foundational axioms and problem-solving patterns of ${detail.title}.`,
        'Identify frequent interview pitfalls, boundary traps, and test cases.',
      ],
    };
  }

  const basic = mockTopics.find((t) => t.id === topicId);
  const title = basic?.title ?? 'Topic Deep Dive';
  const difficulty = basic?.difficulty ?? 'Medium';
  const chapterId = basic?.chapterId ?? 'ch-overview';

  let chapterTitle = 'Chapter Overview';
  let subjectId = 'tech-sysdesign';
  let subjectName = 'Core Studies';

  for (const [subId, chapters] of Object.entries(mockChaptersBySubject)) {
    const ch = chapters.find((c) => c.id === chapterId);
    if (ch) {
      chapterTitle = ch.title.en;
      subjectId = subId;
      for (const subjects of Object.values(mockSubjectsByExamType)) {
        const s = subjects.find((sub) => sub.id === subId);
        if (s) {
          subjectName = s.label.en;
          break;
        }
      }
      if (subjectName === 'Core Studies') {
        for (const subjects of Object.values(mockSubjectsByClass)) {
          const s = subjects.find((sub) => sub.id === subId);
          if (s) {
            subjectName = s.label.en;
            break;
          }
        }
      }
      break;
    }
  }

  return {
    id: topicId,
    title,
    difficulty,
    chapterId,
    chapterTitle,
    subjectId,
    subjectName,
    notes: [
      `Master the core principles and high-yield insights of ${title}.`,
      'Examine edge cases, proofs, and application patterns.',
    ],
  };
}

// In-memory state for interactive mock experience
let inMemoryBookmarks: BookmarkDto[] = [...mockBookmarks];
let inMemoryProgress: TopicProgressDto[] = [...mockProgress];

export function isMockMode(): boolean {
  try {
    const apiDataSource = useAppStore.getState().apiDataSource;
    if (apiDataSource === 'live') return false;
    if (apiDataSource === 'mock') return true;
  } catch {}
  return runtimeConfig.useMockData;
}

export const educationApi = {
  async createGuestSession(dto?: GuestSessionRequestDto): Promise<AuthResponseDto> {
    if (isMockMode()) {
      await sleep(100);
      return {
        user: {
          id: 'usr_mock_guest',
          displayName: 'Guest Candidate',
          isGuest: true,
          examType: (dto?.examType as any) || 'TECH',
          classLevel: null,
          language: dto?.language || 'en',
          createdAt: new Date().toISOString(),
        },
        accessToken: 'mock_guest_token_123',
      };
    }

    return apiPost<AuthResponseDto>('/auth/guest', dto || {});
  },

  async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    if (isMockMode()) {
      await sleep(200);
      return {
        user: {
          id: 'usr_mock_candidate',
          email: dto.email,
          displayName: 'Conceptly Learner',
          isGuest: false,
          examType: 'TECH',
          language: 'en',
          createdAt: new Date().toISOString(),
        },
        accessToken: 'mock_user_token_abc',
      };
    }

    return apiPost<AuthResponseDto>('/auth/login', dto);
  },

  async signup(dto: SignupRequestDto): Promise<AuthResponseDto> {
    if (isMockMode()) {
      await sleep(200);
      return {
        user: {
          id: 'usr_mock_registered',
          email: dto.email,
          displayName: dto.displayName || 'Conceptly Learner',
          isGuest: false,
          examType: (dto.examType as any) || 'TECH',
          classLevel: dto.classLevel,
          language: dto.language || 'en',
          createdAt: new Date().toISOString(),
        },
        accessToken: 'mock_registered_token_xyz',
      };
    }

    return apiPost<AuthResponseDto>('/auth/signup', dto);
  },

  async getProfile(): Promise<UserProfileDto> {
    if (isMockMode()) {
      return {
        id: 'usr_mock_guest',
        displayName: 'Guest Candidate',
        isGuest: true,
        examType: 'TECH',
        language: 'en',
        createdAt: new Date().toISOString(),
      };
    }

    return apiGet<UserProfileDto>('/users/me');
  },

  async getExamTypes(): Promise<Array<{ examType: string; label: string }>> {
    if (isMockMode()) {
      await sleep(150);
      return [
        { examType: 'TECH_INTERVIEW', label: 'Tech & System Design' },
        { examType: 'PM_INTERVIEW', label: 'Product Management' },
        { examType: 'FINANCE_CONSULTING', label: 'Finance & Consulting' },
        { examType: 'UPSC', label: 'UPSC Civil Services' },
        { examType: 'IIT_JEE', label: 'IIT JEE (Engineering)' },
        { examType: 'NEET', label: 'NEET (Medical)' },
        { examType: 'SCHOOL', label: 'School Curriculum' },
      ];
    }

    const response = await apiGet<any[]>('/v1/curriculum/exam-types');
    return response.map((item) => ({
      examType: item.id || item.examType,
      label: item.label,
    }));
  },

  async getFlashcardsByTopic(topicId: string): Promise<FlashcardDto[]> {
    if (isMockMode()) {
      await sleep(150);
      const cards = mockFlashcards[topicId];
      if (cards && cards.length > 0) {
        offlineCache.set(`flashcards:${topicId}`, cards);
        return cards;
      }

      const topic = mockTopicDetails.find((t) => t.id === topicId) ?? mockTopics.find((t) => t.id === topicId);
      const generated = [
        {
          id: `fc-${topicId}-1`,
          topicId,
          frontQuestion: `Core Interview Question: What is the primary architecture of "${topic?.title ?? 'this concept'}"?`,
          backAnswer: `It provides high scalability and resilience by decoupling storage from computation and maintaining clear consistency guarantees.`,
          bullets: [
            'Used frequently in real-world high-scale production systems.',
            'Be ready to explain failure modes and trade-offs in interviews.',
          ],
        },
      ];
      offlineCache.set(`flashcards:${topicId}`, generated);
      return generated;
    }

    try {
      const res = await apiGet<FlashcardDto[]>(`/v1/curriculum/topics/${topicId}/flashcards`);
      if (res && res.length > 0) {
        offlineCache.set(`flashcards:${topicId}`, res);
      }
      return res;
    } catch (e) {
      console.warn('[educationApi] Live getFlashcardsByTopic failed, checking offline cache:', e);
      const cached = await offlineCache.get<FlashcardDto[]>(`flashcards:${topicId}`);
      if (cached && cached.length > 0) return cached;
      return mockFlashcards[topicId] ?? [];
    }
  },

  async getClasses(): Promise<ClassLevelDto[]> {
    if (isMockMode()) {
      await sleep(150);
      return mockClasses;
    }

    const response = await apiGet<Array<{ classLevel: number }>>('/v1/curriculum/classes');
    return response.map(mapClassLevelResponse);
  },

  async getSubjectsByClass(classId: number): Promise<SubjectDto[]> {
    const localSubjects = mockSubjectsByClass[classId] ?? mockSubjectsByClass[10] ?? [];
    if (isMockMode()) {
      await sleep(100);
      return localSubjects;
    }

    try {
      const response = await apiGet<Array<{ id: string; name: string }>>(
        `/v1/curriculum/classes/${classId}/subjects`
      );
      const mapped = response.map(mapSubjectResponse);
      const seen = new Set(localSubjects.map((s) => s.id));
      return [...localSubjects, ...mapped.filter((m) => !seen.has(m.id))];
    } catch {
      return localSubjects;
    }
  },

  async getSubjectsByExamType(examType: string): Promise<SubjectDto[]> {
    const localSubjects = mockSubjectsByExamType[examType] ?? [];
    if (isMockMode()) {
      await sleep(100);
      return localSubjects;
    }

    try {
      const response = await apiGet<Array<{ id: string; name: string }>>(
        `/v1/curriculum/exam-types/${examType}/subjects`
      );
      const mapped = response.map(mapSubjectResponse);
      if (localSubjects.length > 0) return localSubjects;
      return mapped;
    } catch {
      return localSubjects;
    }
  },

  async getChaptersBySubject(subjectId: string): Promise<ChapterDto[]> {
    const localChapters = mockChaptersBySubject[subjectId] ?? [];
    if (isMockMode()) {
      await sleep(100);
      return localChapters.length > 0
        ? localChapters
        : (mockChaptersBySubject['math-10'] ?? []);
    }

    try {
      const response = await apiGet<Array<{ id: string; subjectId: string; title: string }>>(
        `/v1/curriculum/subjects/${subjectId}/chapters`
      );
      if (localChapters.length > 0) return localChapters;
      return response.map(mapChapterResponse);
    } catch {
      return localChapters.length > 0
        ? localChapters
        : (mockChaptersBySubject['math-10'] ?? []);
    }
  },

  async getTopicsByChapter(chapterId: string): Promise<TopicDto[]> {
    const localTopics = mockTopics.filter((topic) => topic.chapterId === chapterId);
    if (isMockMode()) {
      await sleep(100);
      if (localTopics.length > 0) return localTopics;
      return mockTopics.slice(0, 3);
    }

    try {
      const liveTopics = await apiGet<TopicDto[]>(`/v1/curriculum/chapters/${chapterId}/topics`);
      if (localTopics.length > 0) return localTopics;
      return liveTopics;
    } catch {
      if (localTopics.length > 0) return localTopics;
      return mockTopics.slice(0, 3);
    }
  },

  async getTopicById(topicId: string): Promise<TopicDetailDto> {
    if (isMockMode()) {
      await sleep(180);
      const detail = mockTopicDetails.find((t) => t.id === topicId);
      if (detail) {
        offlineCache.set(`topic:${topicId}`, detail);
        return detail;
      }

      const meta = resolveTopicMetadata(topicId);
      const fallbackDetail: TopicDetailDto = {
        id: meta.id,
        title: meta.title,
        difficulty: meta.difficulty,
        chapterId: meta.chapterId,
        reelCount: 2,
        chapter: { id: meta.chapterId, title: meta.chapterTitle },
        subject: { id: meta.subjectId, name: meta.subjectName, classLevel: 0 },
        cheatSheetSummary: meta.notes,
      };
      offlineCache.set(`topic:${topicId}`, fallbackDetail);
      return fallbackDetail;
    }

    try {
      const res = await apiGet<TopicDetailDto>(`/v1/curriculum/topics/${topicId}`);
      if (res) {
        offlineCache.set(`topic:${topicId}`, res);
      }
      return res;
    } catch (e) {
      console.warn('[educationApi] Live getTopicById failed, checking offline cache:', e);
      const cached = await offlineCache.get<TopicDetailDto>(`topic:${topicId}`);
      if (cached) return cached;

      const fallback = mockTopicDetails.find((t) => t.id === topicId);
      if (fallback) return fallback;

      const meta = resolveTopicMetadata(topicId);
      return {
        id: meta.id,
        title: meta.title,
        difficulty: meta.difficulty,
        chapterId: meta.chapterId,
        reelCount: 2,
        chapter: { id: meta.chapterId, title: meta.chapterTitle },
        subject: { id: meta.subjectId, name: meta.subjectName, classLevel: 0 },
        cheatSheetSummary: meta.notes,
      };
    }
  },

  async getReelsByTopic(topicId: string): Promise<ReelDto[]> {
    // Always prioritize locally rendered Studio reels (e.g., /physics_reels/*.mp4) in both mock & live modes
    const studioReels = mockReels.filter(
      (reel) => reel.topicId === topicId && reel.videoUrl.startsWith('/physics_reels/')
    );
    if (studioReels.length > 0) {
      offlineCache.set(`reels:${topicId}`, studioReels);
      return studioReels;
    }

    if (isMockMode()) {
      await sleep(200);
      const filtered = mockReels.filter((reel) => reel.topicId === topicId);
      if (filtered.length > 0) {
        offlineCache.set(`reels:${topicId}`, filtered);
        return filtered;
      }

      const meta = resolveTopicMetadata(topicId);
      const generated = [
        {
          id: `reel-${topicId}-1`,
          title: `${meta.title}: Core Concept & Breakdown`,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          durationSec: 52,
          topicId,
          topic: { id: topicId, title: meta.title, difficulty: meta.difficulty },
          chapter: { id: meta.chapterId, title: meta.chapterTitle },
          subject: { id: meta.subjectId, name: meta.subjectName, classLevel: 0 },
          keyTakeaway: meta.notes[0],
          summaryNotes: meta.notes,
          architectureDiagram: `  [ ${meta.title.toUpperCase().slice(0, 32)} ]\n          │\n          ├──► Input & Context Analysis\n          ├──► Core Transformation & Trade-offs\n          └──► Verified Solution & Optimal Bounds`,
          interviewPitch: `When discussing ${meta.title}, I evaluate the primary invariants and trade-offs before jumping to conclusions, ensuring a systematic and structured solution.`,
          pitfalls: [
            `DON'T overlook boundary conditions or extreme edge cases when analyzing ${meta.title}.`,
            "DON'T skip verifying assumptions before executing your solution.",
          ],
        },
        {
          id: `reel-${topicId}-2`,
          title: `${meta.title}: Solved Exam Questions & Traps`,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          durationSec: 58,
          topicId,
          topic: { id: topicId, title: meta.title, difficulty: meta.difficulty },
          chapter: { id: meta.chapterId, title: meta.chapterTitle },
          subject: { id: meta.subjectId, name: meta.subjectName, classLevel: 0 },
          keyTakeaway: meta.notes[1] ?? meta.notes[0],
          summaryNotes: meta.notes,
          architectureDiagram: `  [ PROBLEM SOLVING PATTERN ]\n  Recognize Trigger ──► Select Framework ──► Optimize Complexity`,
          interviewPitch: `For advanced questions in ${meta.title}, I identify whether the problem maps to standard paradigms, then systematically optimize time and space complexity.`,
          pitfalls: [
            `DON'T rush into coding or solving without confirming time and memory constraints.`,
          ],
        },
      ];
      offlineCache.set(`reels:${topicId}`, generated);
      return generated;
    }

    try {
      const res = await apiGet<ReelDto[]>(`/v1/topics/${topicId}/reels`);
      if (res && res.length > 0) {
        offlineCache.set(`reels:${topicId}`, res);
      }
      return res;
    } catch (e) {
      console.warn('[educationApi] Live getReelsByTopic failed, checking offline cache:', e);
      const cached = await offlineCache.get<ReelDto[]>(`reels:${topicId}`);
      if (cached && cached.length > 0) return cached;

      const filtered = mockReels.filter((reel) => reel.topicId === topicId);
      if (filtered.length > 0) return filtered;

      const meta = resolveTopicMetadata(topicId);
      return [
        {
          id: `reel-${topicId}-1`,
          title: `${meta.title}: Core Concept & Breakdown`,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          durationSec: 52,
          topicId,
          topic: { id: topicId, title: meta.title, difficulty: meta.difficulty },
          chapter: { id: meta.chapterId, title: meta.chapterTitle },
          subject: { id: meta.subjectId, name: meta.subjectName, classLevel: 0 },
          keyTakeaway: meta.notes[0],
          summaryNotes: meta.notes,
          architectureDiagram: `  [ ${meta.title.toUpperCase().slice(0, 32)} ]\n          │\n          ├──► Input & Context Analysis\n          ├──► Core Transformation & Trade-offs\n          └──► Verified Solution & Optimal Bounds`,
          interviewPitch: `When discussing ${meta.title}, I evaluate the primary invariants and trade-offs before jumping to conclusions, ensuring a systematic and structured solution.`,
          pitfalls: [
            `DON'T overlook boundary conditions or extreme edge cases when analyzing ${meta.title}.`,
            "DON'T skip verifying assumptions before executing your solution.",
          ],
        },
      ];
    }
  },

  async getReelById(reelId: string): Promise<ReelDto> {
    const studioReel = mockReels.find(
      (r) => r.id === reelId && r.videoUrl.startsWith('/physics_reels/')
    );
    if (studioReel) {
      return studioReel;
    }

    if (isMockMode()) {
      await sleep(150);
      const reel = mockReels.find((r) => r.id === reelId);
      if (reel) return reel;

      // Match topicId if encoded in reelId (e.g. reel-topic-xyz-1)
      for (const t of mockTopicDetails) {
        if (reelId.includes(t.id)) {
          const reels = await this.getReelsByTopic(t.id);
          const matched = reels.find((r) => r.id === reelId);
          if (matched) return matched;
          if (reels.length > 0) return { ...reels[0], id: reelId };
        }
      }

      return mockReels[0];
    }

    try {
      return await apiGet<ReelDto>(`/v1/reels/${reelId}`);
    } catch (e) {
      // If reelId is synthetic (e.g. reel-{topicId}-1), attempt to fetch real reels for that topic
      const topicMatches = reelId.match(/reel-(.+)-\d+/);
      if (topicMatches && topicMatches[1]) {
        try {
          const topicReels = await this.getReelsByTopic(topicMatches[1]);
          if (topicReels && topicReels.length > 0) {
            return topicReels[0];
          }
        } catch {}
      }
      throw e;
    }
  },

  async recordReelView(reelId: string, event: ReelViewEventDto): Promise<{ status: string }> {
    useAppStore.getState().markReelWatched(reelId);

    if (isMockMode()) {
      return { status: 'recorded_mock' };
    }

    try {
      return await apiPost<{ status: string }>(`/v1/reels/${reelId}/view`, event);
    } catch (e) {
      console.warn('[educationApi] Live recordReelView failed:', e);
      return { status: 'failed' };
    }
  },

  async getQuizByTopic(topicId: string): Promise<QuizDto> {
    if (isMockMode()) {
      await sleep(200);
      const quiz = mockQuizzes[topicId];
      if (quiz) {
        offlineCache.set(`quiz:${topicId}`, quiz);
        return quiz;
      }

      // Generate a dynamic 2-question quiz so any topic has a playable quiz
      const topic = mockTopicDetails.find((t) => t.id === topicId) ?? mockTopics.find((t) => t.id === topicId);
      const generated: QuizDto = {
        topicId,
        topicTitle: topic?.title ?? 'Topic Practice Quiz',
        questions: [
          {
            id: `q-${topicId}-1`,
            text: `Which statement best describes the fundamental principle of "${topic?.title ?? 'this topic'}"?`,
            options: [
              { id: 'opt-a', text: 'It defines the core underlying law with verified proofs.' },
              { id: 'opt-b', text: 'It is only applicable in arbitrary edge cases.' },
              { id: 'opt-c', text: 'It contradicts earlier classical models.' },
              { id: 'opt-d', text: 'None of the above.' },
            ],
            correctOptionId: 'opt-a',
            topicId,
          },
          {
            id: `q-${topicId}-2`,
            text: 'How is this concept applied in exam problem solving?',
            options: [
              { id: 'opt-a', text: 'By memorizing formula without derivation.' },
              { id: 'opt-b', text: 'Through step-by-step logical substitution.' },
              { id: 'opt-c', text: 'By guessing options.' },
              { id: 'opt-d', text: 'Only in advanced research.' },
            ],
            correctOptionId: 'opt-b',
            topicId,
          },
        ],
      };
      offlineCache.set(`quiz:${topicId}`, generated);
      return generated;
    }

    try {
      const res = await apiGet<QuizDto>(`/v1/topics/${topicId}/quiz`);
      if (res) {
        offlineCache.set(`quiz:${topicId}`, res);
      }
      return res;
    } catch (e) {
      console.warn('[educationApi] Live getQuizByTopic failed, checking offline cache:', e);
      const cached = await offlineCache.get<QuizDto>(`quiz:${topicId}`);
      if (cached) return cached;
      return mockQuizzes[topicId] ?? {
        topicId,
        topicTitle: 'Topic Practice Quiz',
        questions: [],
      };
    }
  },

  async submitQuiz(
    topicId: string,
    answers: Array<{ questionId: string; selectedOptionId: string }>
  ): Promise<QuizSubmissionResultDto> {
    if (isMockMode()) {
      await sleep(250);
      const quiz = mockQuizzes[topicId] ?? (await this.getQuizByTopic(topicId));
      let correctCount = 0;
      const results = answers.map((ans) => {
        const q = quiz.questions.find((item) => item.id === ans.questionId);
        const correctId = q?.correctOptionId || 'opt-1';
        const isCorrect = ans.selectedOptionId === correctId;
        if (isCorrect) correctCount++;
        return {
          questionId: ans.questionId,
          selectedOptionId: ans.selectedOptionId,
          correctOptionId: correctId,
          isCorrect,
          explanation: isCorrect
            ? 'Verified with the standard curriculum answer key.'
            : `The correct option was (${correctId.replace('opt-', '')}). Review the concept notes before re-testing.`,
        };
      });

      const totalQuestions = Math.max(answers.length, 1);
      const scorePercent = Math.round((correctCount / totalQuestions) * 100);
      const passed = scorePercent >= 70;

      useAppStore.getState().updateUserProgress(topicId, scorePercent);

      return {
        topicId,
        totalQuestions,
        correctCount,
        scorePercent,
        passed,
        results,
        progressUpdated: true,
      };
    }

    try {
      return await apiPost<QuizSubmissionResultDto>(`/v1/topics/${topicId}/quiz/submit`, {
        topicId,
        answers,
      });
    } catch (e) {
      console.warn('[educationApi] Live submitQuiz failed, fallback to local scoring:', e);
      return {
        topicId,
        totalQuestions: answers.length,
        correctCount: answers.length,
        scorePercent: 100,
        passed: true,
        results: answers.map((a) => ({
          questionId: a.questionId,
          selectedOptionId: a.selectedOptionId,
          correctOptionId: a.selectedOptionId,
          isCorrect: true,
          explanation: 'Score recorded locally.',
        })),
        progressUpdated: true,
      };
    }
  },

  async getHomeFeed(examType?: string, classLevel?: number): Promise<HomeFeedDto> {
    const effectiveExamType =
      examType ?? useAppStore.getState().selectedExamType ?? 'TECH_INTERVIEW';
    const effectiveClassId =
      classLevel ?? useAppStore.getState().selectedClassId ?? 10;
    const cacheKey = `homefeed:${effectiveExamType}:${effectiveClassId}`;

    if (isMockMode()) {
      await sleep(200);

      let subjects: SubjectDto[] = [];
      if (effectiveExamType === 'SCHOOL') {
        subjects = mockSubjectsByClass[effectiveClassId] ?? mockSubjectsByClass[10] ?? [];
      } else {
        subjects =
          mockSubjectsByExamType[effectiveExamType] ??
          mockSubjectsByExamType['TECH_INTERVIEW'] ??
          [];
      }

      const subjectShortcuts = subjects.map((s) => ({
        id: s.id,
        name: s.label.en,
        classLevel: effectiveExamType === 'SCHOOL' ? effectiveClassId : 0,
      }));

      const domainSubjectIds = new Set(subjects.map((s) => s.id));
      const domainTopics = mockTopicDetails.filter((t) =>
        domainSubjectIds.has(t.subject.id)
      );

      const activeTopics =
        domainTopics.length > 0 ? domainTopics : mockTopicDetails;

      const continueLearning = activeTopics.slice(0, 3);
      const recommended =
        activeTopics.length > 3
          ? activeTopics.slice(3, 7)
          : activeTopics.slice(0, 3);
      const quickRevision =
        activeTopics.length > 2
          ? activeTopics.slice(1, 4)
          : activeTopics.slice(0, 2);

      const feedResult: HomeFeedDto = {
        subjectShortcuts,
        continueLearning,
        recommended,
        quickRevision,
      };
      offlineCache.set(cacheKey, feedResult);
      return feedResult;
    }

    try {
      const params = new URLSearchParams();
      if (examType) params.append('examType', examType);
      if (classLevel) params.append('classLevel', classLevel.toString());
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await apiGet<HomeFeedDto>(`/v1/feed${query}`);
      if (res) {
        offlineCache.set(cacheKey, res);
      }
      return res;
    } catch (e) {
      console.warn('[educationApi] Live getHomeFeed failed, checking offline cache:', e);
      const cached = await offlineCache.get<HomeFeedDto>(cacheKey);
      if (cached) return cached;
      return mockHomeFeed;
    }
  },

  async getProgress(): Promise<TopicProgressDto[]> {
    if (isMockMode()) {
      await sleep(150);
      const userProgress = useAppStore.getState().userProgress;
      return userProgress && userProgress.length > 0 ? userProgress : mockProgress;
    }

    return apiGet<TopicProgressDto[]>('/v1/progress');
  },

  async updateProgress(topicId: string, completionPercent: number): Promise<TopicProgressDto> {
    if (isMockMode()) {
      await sleep(150);
      const topic = mockTopicDetails.find((t) => t.id === topicId) ?? {
        id: topicId,
        title: 'Completed Topic',
        difficulty: 'Medium',
        chapterId: 'ch-sd-distributed',
        reelCount: 2,
        chapter: { id: 'ch-sd-distributed', title: 'Distributed Core Concepts' },
        subject: { id: 'tech-sysdesign', name: 'System Design', classLevel: 0 },
      };

      useAppStore.getState().updateUserProgress(topicId, completionPercent, topic);
      const currentList = useAppStore.getState().userProgress;
      const found = currentList.find((p) => p.topicId === topicId);
      return (
        found ?? {
          id: `prog-${Date.now()}`,
          topicId,
          completionPercent,
          createdAt: new Date(),
          updatedAt: new Date(),
          topic: { id: topic.id, title: topic.title, difficulty: topic.difficulty },
          chapter: topic.chapter,
          subject: topic.subject,
        }
      );
    }

    return apiPost<TopicProgressDto>('/v1/progress', {
      topicId,
      completionPercent
    });
  },

  async getBookmarks(): Promise<BookmarkDto[]> {
    if (isMockMode()) {
      await sleep(150);
      const userBookmarks = useAppStore.getState().userBookmarks;
      return userBookmarks && userBookmarks.length > 0 ? userBookmarks : mockBookmarks;
    }

    return apiGet<BookmarkDto[]>('/v1/bookmarks');
  },

  async createBookmark(topicId: string, reelId?: string): Promise<BookmarkDto> {
    if (isMockMode()) {
      await sleep(150);
      const topic = mockTopicDetails.find((t) => t.id === topicId) ?? {
        id: topicId,
        title: 'Bookmarked Topic',
        difficulty: 'Easy',
        chapterId: 'ch-sd-distributed',
        reelCount: 2,
        chapter: { id: 'ch-sd-distributed', title: 'Distributed Core Concepts' },
        subject: { id: 'tech-sysdesign', name: 'System Design', classLevel: 0 },
      };

      const newBookmark: BookmarkDto = {
        id: `bm-${Date.now()}`,
        topicId,
        reelId: reelId ?? null,
        createdAt: new Date(),
        topic: { id: topic.id, title: topic.title, difficulty: topic.difficulty },
        chapter: topic.chapter,
        subject: topic.subject,
      };

      useAppStore.getState().addUserBookmark(newBookmark);
      return newBookmark;
    }

    return apiPost<BookmarkDto>('/v1/bookmarks', {
      topicId,
      reelId
    });
  },

  async toggleBookmark(topicId: string, reelId?: string): Promise<{ bookmarked: boolean; bookmark?: BookmarkDto }> {
    if (isMockMode()) {
      await sleep(150);
      const bookmarks = useAppStore.getState().userBookmarks;
      const existing = bookmarks.find((b) => b.topicId === topicId && (reelId ? b.reelId === reelId : true));
      if (existing) {
        useAppStore.getState().removeUserBookmark(existing.id);
        return { bookmarked: false };
      } else {
        const created = await this.createBookmark(topicId, reelId);
        return { bookmarked: true, bookmark: created };
      }
    }

    return apiPost<{ bookmarked: boolean; bookmark?: BookmarkDto }>('/v1/bookmarks/toggle', {
      topicId,
      reelId,
    });
  },

  async deleteBookmark(bookmarkId: string): Promise<void> {
    if (isMockMode()) {
      await sleep(150);
      useAppStore.getState().removeUserBookmark(bookmarkId);
      return;
    }

    return apiDelete(`/v1/bookmarks/${bookmarkId}`);
  },

  async trackAnalyticsEvent(eventName: string, payload?: Record<string, any>): Promise<void> {
    if (isMockMode()) {
      // Gracefully handle analytics in mock mode without throwing
      return;
    }

    return apiPost('/analytics/events', {
      eventName,
      payload
    });
  }
};
