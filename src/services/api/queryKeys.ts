export const educationQueryKeys = {
  classes: () => ['education', 'classes'] as const,
  subjectsByClass: (classLevelId: number) =>
    ['education', 'subjects', classLevelId] as const,
  chapterById: (chapterId: string) =>
    ['education', 'chapter', chapterId] as const,
  topicById: (topicId: string) => ['education', 'topic', topicId] as const,
  // Future keys (used in later phases)
  chaptersBySubject: (classLevelId: number, subjectId: string) =>
    ['education', 'chapters', classLevelId, subjectId] as const,
  topicsByChapter: (chapterId: string) => ['education', 'topics', chapterId] as const,
  reelsByTopic: (topicId: string) =>
    ['education', 'reels', topicId] as const,
  reelsByIds: (reelIds: readonly string[]) =>
    ['education', 'reelsByIds', [...reelIds].sort()] as const,
  homeFeedForSubject: (classLevelId: number, subjectId: string) =>
    ['education', 'homeFeed', classLevelId, subjectId] as const
};

