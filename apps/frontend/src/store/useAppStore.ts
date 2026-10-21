import { create } from 'zustand';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BookmarkDto, TopicProgressDto } from '@/services/api/types';
import { mockBookmarks, mockProgress } from '@/services/api/mockData';
import type { ThemeMode } from '@/theme/types';

export type DomainCategory =
  | 'TECH_INTERVIEW'
  | 'PM_INTERVIEW'
  | 'FINANCE_CONSULTING'
  | 'UPSC'
  | 'IIT_JEE'
  | 'NEET'
  | 'SCHOOL';

type OnboardingStep = 'welcome' | 'exam-type' | 'class' | 'subject' | 'chapter' | 'done';
export type ViewMode = 'mobile' | 'desktop';
export type ApiDataSource = 'mock' | 'live';

const STORAGE_KEY = 'conceptly-app-storage';
const LEGACY_STORAGE_KEY = 'revisex-app-storage';

function loadPersistedState(): Partial<AppState> {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw =
        window.localStorage.getItem(STORAGE_KEY) ||
        window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load persisted state from localStorage:', e);
    }
  }
  return {};
}

function savePersistedState(state: AppState) {
  const toSave = {
    theme: state.theme,
    onboardingStep: state.onboardingStep,
    selectedExamType: state.selectedExamType,
    selectedClassId: state.selectedClassId,
    selectedSubjectId: state.selectedSubjectId,
    selectedChapterId: state.selectedChapterId,
    language: state.language,
    playbackSpeed: state.playbackSpeed,
    watchedReels: state.watchedReels,
    userBookmarks: state.userBookmarks,
    userProgress: state.userProgress,
    viewMode: state.viewMode,
    apiDataSource: state.apiDataSource,
    authToken: state.authToken,
    userEmail: state.userEmail,
    userName: state.userName,
  };

  const jsonStr = JSON.stringify(toSave);

  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, jsonStr);
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  } else {
    AsyncStorage.setItem(STORAGE_KEY, jsonStr).catch((e) => {
      console.warn('Failed to save state to AsyncStorage:', e);
    });
  }
}

export async function hydrateAppStore() {
  if (Platform.OS !== 'web') {
    try {
      let raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        raw = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
      }
      if (raw) {
        const parsed = JSON.parse(raw);
        useAppStore.setState((state) => ({
          ...state,
          ...parsed,
        }));
      }
    } catch (e) {
      console.warn('Failed to hydrate state from AsyncStorage:', e);
    }
  }
}

export type AppState = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  viewMode: ViewMode;
  onboardingStep: OnboardingStep;
  selectedExamType: DomainCategory | string | null;
  selectedClassId: number | null;
  selectedSubjectId: string | null;
  selectedChapterId: string | null;
  language: 'en' | 'hi';
  playbackSpeed: number;
  watchedReels: Record<string, boolean>;
  userBookmarks: BookmarkDto[];
  userProgress: TopicProgressDto[];
  apiDataSource: ApiDataSource;
  authToken: string | null;
  userEmail: string | null;
  userName: string | null;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  setApiDataSource: (source: ApiDataSource) => void;
  toggleApiDataSource: () => void;
  setAuthToken: (token: string | null) => void;
  setUserInfo: (info: { email: string | null; name: string | null }) => void;
  logout: () => void;
  setOnboardingStep: (step: OnboardingStep) => void;
  setExamType: (examType: DomainCategory | string) => void;
  setClassId: (classId: number) => void;
  setSubjectId: (subjectId: string) => void;
  setChapterId: (chapterId: string) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  setPlaybackSpeed: (speed: number) => void;
  markReelWatched: (reelId: string) => void;
  addUserBookmark: (bookmark: BookmarkDto) => void;
  removeUserBookmark: (bookmarkId: string) => void;
  updateUserProgress: (topicId: string, completionPercent: number, topicDetails?: any) => void;
};

const initialPersisted = loadPersistedState();

export const useAppStore = create<AppState>((set) => ({
  theme: (initialPersisted.theme as ThemeMode) ?? 'dark',
  setTheme: (theme: ThemeMode) => {
    set({ theme });
    setTimeout(() => {
      savePersistedState(useAppStore.getState());
    }, 0);
  },
  viewMode:
    initialPersisted.viewMode ??
    (Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth >= 768
      ? 'desktop'
      : 'mobile'),
  onboardingStep: initialPersisted.onboardingStep ?? 'welcome',
  selectedExamType: initialPersisted.selectedExamType ?? 'TECH_INTERVIEW',
  selectedClassId: initialPersisted.selectedClassId ?? 10,
  selectedSubjectId: initialPersisted.selectedSubjectId ?? 'tech-sysdesign',
  selectedChapterId: initialPersisted.selectedChapterId ?? 'ch-sd-distributed',
  language: initialPersisted.language ?? 'en',
  playbackSpeed: initialPersisted.playbackSpeed ?? 1.0,
  watchedReels: initialPersisted.watchedReels ?? {
    'reel-cap-1': true,
    'reel-hashing-1': true,
  },
  userBookmarks: initialPersisted.userBookmarks ?? mockBookmarks,
  userProgress: initialPersisted.userProgress ?? mockProgress,
  apiDataSource:
    initialPersisted.apiDataSource ??
    ((process.env.EXPO_PUBLIC_DATA_SOURCE as any) || 'live'),
  authToken: initialPersisted.authToken ?? null,
  userEmail: initialPersisted.userEmail ?? null,
  userName: initialPersisted.userName ?? null,
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () =>
    set((state) => ({ viewMode: state.viewMode === 'desktop' ? 'mobile' : 'desktop' })),
  setApiDataSource: (source) => set({ apiDataSource: source }),
  toggleApiDataSource: () =>
    set((state) => ({
      apiDataSource: state.apiDataSource === 'mock' ? 'live' : 'mock',
    })),
  setAuthToken: (token) => set({ authToken: token }),
  setUserInfo: ({ email, name }) => set({ userEmail: email, userName: name }),
  logout: () => set({ authToken: null, userEmail: null, userName: null }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  setExamType: (examType) =>
    set({
      selectedExamType: examType,
      selectedClassId: examType === 'SCHOOL' ? 10 : null,
      selectedSubjectId: null,
      selectedChapterId: null,
      onboardingStep: examType === 'SCHOOL' ? 'class' : 'subject',
    }),
  setClassId: (classId) =>
    set({
      selectedClassId: classId,
      selectedSubjectId: null,
      selectedChapterId: null,
      onboardingStep: 'subject',
    }),
  setSubjectId: (subjectId) =>
    set({
      selectedSubjectId: subjectId,
      selectedChapterId: null,
      onboardingStep: 'chapter',
    }),
  setChapterId: (chapterId) =>
    set({
      selectedChapterId: chapterId,
      onboardingStep: 'done',
    }),
  setLanguage: (language) => set({ language }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  markReelWatched: (reelId) =>
    set((state) => ({
      watchedReels: {
        ...state.watchedReels,
        [reelId]: true,
      },
    })),
  addUserBookmark: (bookmark) =>
    set((state) => {
      if (
        state.userBookmarks.some(
          (b) =>
            b.id === bookmark.id ||
            (b.topicId === bookmark.topicId && b.reelId === bookmark.reelId)
        )
      ) {
        return state;
      }
      return {
        userBookmarks: [bookmark, ...state.userBookmarks],
      };
    }),
  removeUserBookmark: (bookmarkId) =>
    set((state) => ({
      userBookmarks: state.userBookmarks.filter(
        (b) => b.id !== bookmarkId && b.topicId !== bookmarkId
      ),
    })),
  updateUserProgress: (topicId, completionPercent, topicDetails) =>
    set((state) => {
      const existingIdx = state.userProgress.findIndex((p) => p.topicId === topicId);
      if (existingIdx >= 0) {
        const updated = [...state.userProgress];
        updated[existingIdx] = {
          ...updated[existingIdx],
          completionPercent,
          updatedAt: new Date(),
        };
        return { userProgress: updated };
      }
      const newEntry: TopicProgressDto = {
        id: `prog-${Date.now()}`,
        topicId,
        completionPercent,
        createdAt: new Date(),
        updatedAt: new Date(),
        topic: {
          id: topicId,
          title: topicDetails?.title ?? 'Completed Topic',
          difficulty: topicDetails?.difficulty ?? 'Medium',
        },
        chapter: {
          id: topicDetails?.chapter?.id ?? 'ch-overview',
          title: topicDetails?.chapter?.title ?? 'Chapter Overview',
        },
        subject: {
          id: topicDetails?.subject?.id ?? 'tech-sysdesign',
          name: topicDetails?.subject?.name ?? 'System Design',
          classLevel: topicDetails?.subject?.classLevel ?? 0,
        },
      };
      return { userProgress: [newEntry, ...state.userProgress] };
    }),
}));

useAppStore.subscribe((state) => {
  savePersistedState(state);
});
