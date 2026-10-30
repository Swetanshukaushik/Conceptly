export type ClassLevelDto = {
  id: number;
  label: { en: string; hi: string };
};

export type SubjectDto = {
  id: string;
  label: { en: string; hi: string };
  iconName?: string;
};

export type ChapterDto = {
  id: string;
  subjectId: string;
  title: { en: string; hi: string };
};

export type TopicDto = {
  id: string;
  title: string;
  difficulty: string;
  chapterId: string;
  reelCount: number;
};

export type TopicDetailDto = {
  id: string;
  title: string;
  difficulty: string;
  chapterId: string;
  reelCount: number;
  chapter: { id: string; title: string };
  subject: { id: string; name: string; classLevel: number };
  cheatSheetSummary?: string[];
};

export type ReelDto = {
  id: string;
  title: string;
  videoUrl: string;
  durationSec?: number;
  duration?: string;
  topicId: string;
  topic: { id: string; title: string; difficulty: string };
  chapter: { id: string; title: string };
  subject: { id: string; name: string; classLevel: number };
  keyTakeaway?: string;
  summaryNotes?: string[];
  architectureDiagram?: string;
  interviewPitch?: string;
  pitfalls?: string[];
  subtitlesUrl?: string;
  captions?: Array<{ startSec: number; endSec: number; text: string }>;
};

export type QuizOptionDto = {
  id: string;
  text: string;
};

export type QuizQuestionDto = {
  id: string;
  text: string;
  options: QuizOptionDto[];
  correctOptionId: string;
  topicId: string;
};

export type QuizDto = {
  topicId: string;
  topicTitle: string;
  questions: QuizQuestionDto[];
};

export type QuizQuestionResultDto = {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  explanation: string;
};

export type QuizSubmissionResultDto = {
  topicId: string;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  passed: boolean;
  results: QuizQuestionResultDto[];
  progressUpdated: boolean;
};

export type ReelViewEventDto = {
  reelId: string;
  watchDurationSec: number;
  completed: boolean;
};

export type FlashcardDto = {
  id: string;
  topicId: string;
  frontQuestion: string;
  backAnswer: string;
  bullets?: string[];
};

export type TopicProgressDto = {
  id: string;
  topicId: string;
  completionPercent: number;
  createdAt: Date;
  updatedAt: Date;
  topic: { id: string; title: string; difficulty: string };
  chapter: { id: string; title: string };
  subject: { id: string; name: string; classLevel: number };
};

export type BookmarkDto = {
  id: string;
  topicId: string;
  reelId: string | null;
  createdAt: Date;
  topic: { id: string; title: string; difficulty: string };
  chapter: { id: string; title: string };
  subject: { id: string; name: string; classLevel: number };
};

export type TrendingReelSortBy =
  | 'trending'
  | 'top_grossing'
  | 'most_rewatched'
  | 'community_picks';

export type TrendingTimeWindow = '24h' | '7d' | '30d' | 'all_time';

export type TrendingBadgeType =
  | 'TRENDING_1'
  | 'TOP_GROSSING'
  | 'HIGH_RETENTION'
  | 'COMMUNITY_FAVORITE'
  | 'RISING_FAST';

export type ReelEngagementMetricsDto = {
  viewsCount: number;
  completionsCount: number;
  completionRate: number;
  rewatchesCount: number;
  likesCount: number;
  bookmarksCount: number;
  sharesCount: number;
  commentsCount: number;
  activeLearnersNow: number;
  trendingScore: number;
  velocityDeltaPercent: number;
  quizPassRate: number;
};

export type ReelCommunityHighlightDto = {
  authorName: string;
  authorBadge: string;
  topComment: string;
  upvotesCount: number;
  createdAt: string;
};

export type ReelViewerStateDto = {
  isLiked: boolean;
  isBookmarked: boolean;
  isWatched: boolean;
};

export type TrendingReelDto = ReelDto & {
  rank: number;
  badge: TrendingBadgeType;
  badgeLabel: string;
  metrics: ReelEngagementMetricsDto;
  communityHighlight: ReelCommunityHighlightDto;
  viewerState?: ReelViewerStateDto;
};

export type CommunityPulseStatsDto = {
  activeLearnersNow: number;
  reelsWatchedToday: number;
  totalCommunityUpvotes: number;
  topTrendingSubject: string;
  avgCompletionRate: number;
};

export type TrendingReelsQueryDto = {
  sortBy?: TrendingReelSortBy;
  timeWindow?: TrendingTimeWindow;
  examType?: string;
  cursor?: string;
  limit?: number;
};

export type CommunityReelFeedResponseDto = {
  items: TrendingReelDto[];
  communityPulse: CommunityPulseStatsDto;
  sortBy: TrendingReelSortBy;
  timeWindow: TrendingTimeWindow;
  nextCursor?: string | null;
};

export type ReelEngageActionType =
  | 'like'
  | 'unlike'
  | 'share'
  | 'rewatch'
  | 'bookmark';

export type ReelEngageRequestDto = {
  reelId: string;
  action: ReelEngageActionType;
};

export type ReelEngageResponseDto = {
  reelId: string;
  action: ReelEngageActionType;
  updatedLikesCount: number;
  updatedSharesCount: number;
  trendingScore: number;
};

export type HomeFeedDto = {
  subjectShortcuts: Array<{ id: string; name: string; classLevel: number }>;
  continueLearning: TopicDetailDto[];
  recommended: TopicDetailDto[];
  quickRevision: TopicDetailDto[];
  trendingReels?: TrendingReelDto[];
};
