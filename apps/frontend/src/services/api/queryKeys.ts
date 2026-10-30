export const queryKeys = {
  classes: () => ['classes'] as const,
  subjectsByClass: (classId: number) => ['subjects', classId] as const,
  chaptersBySubject: (subjectId: string) => ['chapters', subjectId] as const,
  topicsByChapter: (chapterId: string) => ['topics', chapterId] as const,
  topicById: (topicId: string) => ['topic', topicId] as const,
  reelsByTopic: (topicId: string) => ['reels', topicId] as const,
  reel: (reelId: string) => ['reel', reelId] as const,
  quizByTopic: (topicId: string) => ['quiz', topicId] as const,
  flashcardsByTopic: (topicId: string) => ['flashcards', topicId] as const,
  homeFeed: (examType?: string, classLevel?: number) => ['homeFeed', examType, classLevel] as const,
  trendingReels: (sortBy?: string, timeWindow?: string, examType?: string) =>
    ['trendingReels', sortBy, timeWindow, examType] as const,
  progress: () => ['progress'] as const,
  bookmarks: () => ['bookmarks'] as const
};

