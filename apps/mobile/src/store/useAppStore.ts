import { create } from 'zustand';

type OnboardingStep = 'welcome' | 'exam-type' | 'class' | 'subject' | 'chapter' | 'done';

type AppState = {
  onboardingStep: OnboardingStep;
  selectedExamType: 'SCHOOL' | 'UPSC' | 'IIT_JEE' | 'NEET' | null;
  selectedClassId: number | null;
  selectedSubjectId: string | null;
  selectedChapterId: string | null;
  language: 'en' | 'hi';
  bookmarks: Record<string, true>;
  setOnboardingStep: (step: OnboardingStep) => void;
  setExamType: (examType: 'SCHOOL' | 'UPSC' | 'IIT_JEE' | 'NEET') => void;
  setClassId: (classId: number) => void;
  setSubjectId: (subjectId: string) => void;
  setChapterId: (chapterId: string) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  toggleBookmark: (reelId: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  onboardingStep: 'welcome',
  selectedExamType: null,
  selectedClassId: null,
  selectedSubjectId: null,
  selectedChapterId: null,
  language: 'en',
  bookmarks: {},
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  setExamType: (examType) =>
    set({
      selectedExamType: examType,
      selectedClassId: null,
      selectedSubjectId: null,
      selectedChapterId: null,
      onboardingStep: examType === 'SCHOOL' ? 'class' : 'subject'
    }),
  setClassId: (classId) =>
    set({
      selectedClassId: classId,
      selectedSubjectId: null,
      selectedChapterId: null,
      onboardingStep: 'subject'
    }),
  setSubjectId: (subjectId) =>
    set({
      selectedSubjectId: subjectId,
      selectedChapterId: null,
      onboardingStep: 'chapter'
    }),
  setChapterId: (chapterId) =>
    set({
      selectedChapterId: chapterId,
      onboardingStep: 'done'
    }),
  setLanguage: (language) => set({ language }),
  toggleBookmark: (reelId) =>
    set((state) => {
      const next = { ...state.bookmarks };
      if (next[reelId]) delete next[reelId];
      else next[reelId] = true;
      return { bookmarks: next };
    })
}));

