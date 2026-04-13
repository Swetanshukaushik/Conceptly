import { create } from 'zustand';

import type { ChapterId, ClassLevelId, SubjectId } from '@/types/ids';
import type { LanguageCode } from '@/types/i18n';
import { bookmarkedReelIdsMock } from '@/services/mockData/mvp/bookmarksMockData';

export type OnboardingStep =
  | 'welcome'
  | 'class_select'
  | 'subject_select'
  | 'chapter_select'
  | 'completed';

type AppStore = {
  onboarding: {
    step: OnboardingStep;
  };

  selections: {
    selectedClassLevelId: ClassLevelId | null;
    selectedSubjectId: SubjectId | null;
    selectedChapterId: ChapterId | null;
  };

  preferences: {
    language: LanguageCode;
  };

  bookmarks: {
    reelIds: Record<string, true>;
  };

  actions: {
    setLanguage: (language: LanguageCode) => void;
    setOnboardingStep: (step: OnboardingStep) => void;
    setSelectedClassLevelId: (classLevelId: ClassLevelId) => void;
    setSelectedSubjectId: (subjectId: SubjectId) => void;
    setSelectedChapterId: (chapterId: ChapterId) => void;
    resetOnboarding: () => void;
    completeOnboarding: () => void;

    toggleReelBookmark: (reelId: string) => void;
  };
};

export const useAppStore = create<AppStore>((set) => ({
  onboarding: {
    step: 'welcome'
  },
  selections: {
    selectedClassLevelId: null,
    selectedSubjectId: null,
    selectedChapterId: null
  },
  preferences: {
    language: 'en'
  },
  bookmarks: {
    reelIds: Object.fromEntries(bookmarkedReelIdsMock.map((id) => [id, true]))
  },
  actions: {
    setLanguage: (language) =>
      set((state) => ({
        ...state,
        preferences: { ...state.preferences, language }
      })),

    setOnboardingStep: (step) =>
      set((state) => ({
        ...state,
        onboarding: { ...state.onboarding, step }
      })),

    setSelectedClassLevelId: (classLevelId) =>
      set((state) => ({
        ...state,
        selections: {
          ...state.selections,
          selectedClassLevelId: classLevelId,
          // Subject depends on class for later phases, so reset selection.
          selectedSubjectId: null,
          selectedChapterId: null
        },
        onboarding: {
          ...state.onboarding,
          step: 'subject_select'
        }
      })),

    setSelectedSubjectId: (subjectId) =>
      set((state) => ({
        ...state,
        selections: {
          ...state.selections,
          selectedSubjectId: subjectId,
          selectedChapterId: null
        },
        onboarding: {
          ...state.onboarding,
          step: 'chapter_select'
        }
      })),

    setSelectedChapterId: (chapterId) =>
      set((state) => ({
        ...state,
        selections: { ...state.selections, selectedChapterId: chapterId },
        onboarding: {
          ...state.onboarding,
          step: 'completed'
        }
      })),

    resetOnboarding: () =>
      set(() => ({
        onboarding: { step: 'welcome' },
        selections: {
          selectedClassLevelId: null,
          selectedSubjectId: null,
          selectedChapterId: null
        },
        preferences: { language: 'en' }
      })),

    completeOnboarding: () =>
      set((state) => ({
        ...state,
        onboarding: { ...state.onboarding, step: 'completed' }
      })),

    toggleReelBookmark: (reelId) =>
      set((state) => {
        const exists = !!state.bookmarks.reelIds[reelId];
        const next = { ...state.bookmarks.reelIds };
        if (exists) {
          delete next[reelId];
        } else {
          next[reelId] = true;
        }
        return {
          ...state,
          bookmarks: { ...state.bookmarks, reelIds: next }
        };
      })
  }
}));

