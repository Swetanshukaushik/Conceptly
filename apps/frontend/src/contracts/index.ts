/**
 * @conceptly/contracts
 * Shared API contracts and data models between Conceptly backend and mobile client.
 * Keep this file synchronized with apps/backend/src/contracts/index.ts
 */

// ==========================================
// 1. Common & Domain Types
// ==========================================

export type ExamType =
  | 'TECH'
  | 'PM'
  | 'FINANCE'
  | 'UPSC'
  | 'IIT_JEE'
  | 'NEET'
  | 'SCHOOL';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type BilingualText = {
  en: string;
  hi: string;
};

// ==========================================
// 2. Auth & Identity Contracts
// ==========================================

export interface UserProfileDto {
  id: string;
  email?: string;
  displayName: string;
  isGuest: boolean;
  examType: ExamType;
  classLevel?: number | null;
  language: 'en' | 'hi';
  createdAt: string;
  updatedAt?: string;
}

export interface GuestSessionRequestDto {
  deviceId?: string;
  language?: 'en' | 'hi';
  examType?: ExamType;
}

export interface SignupRequestDto {
  email: string;
  password?: string;
  displayName: string;
  examType?: ExamType;
  classLevel?: number;
  language?: 'en' | 'hi';
}

export interface LoginRequestDto {
  email: string;
  password?: string;
}

export interface AuthResponseDto {
  user: UserProfileDto;
  accessToken: string;
  refreshToken?: string;
}

export interface UpdatePreferencesRequestDto {
  displayName?: string;
  examType?: ExamType;
  classLevel?: number | null;
  language?: 'en' | 'hi';
}

// ==========================================
// 3. Curriculum Contracts
// ==========================================

export interface ExamTypeInfoDto {
  id: ExamType;
  label: string;
  description: string;
  icon: string;
  popularTopics: string[];
}

export interface ClassLevelDto {
  id: number;
  label: BilingualText;
}

export interface SubjectSummaryDto {
  id: string;
  name: string;
  label: BilingualText;
  examType: ExamType;
  classLevel?: number;
  chapterCount: number;
  iconName?: string;
}

export interface ChapterSummaryDto {
  id: string;
  subjectId: string;
  title: BilingualText;
  order: number;
  topicCount: number;
}

export interface TopicSummaryDto {
  id: string;
  chapterId: string;
  title: string;
  difficulty: DifficultyLevel;
  reelCount: number;
}

export interface TopicDetailDto {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  chapterId: string;
  reelCount: number;
  chapter: {
    id: string;
    title: string;
  };
  subject: {
    id: string;
    name: string;
    classLevel?: number;
    examType: ExamType;
  };
  cheatSheetSummary?: string[];
}

// ==========================================
// 4. Reels Contracts
// ==========================================

export interface ReelDto {
  id: string;
  title: string;
  videoUrl: string;
  durationSec: number;
  topicId: string;
  keyTakeaway?: string;
  summaryNotes?: string[];
  architectureDiagram?: string;
  interviewPitch?: string;
  pitfalls?: string[];
  topic: {
    id: string;
    title: string;
    difficulty: DifficultyLevel;
  };
  chapter: {
    id: string;
    title: string;
  };
  subject: {
    id: string;
    name: string;
    classLevel?: number;
    examType: ExamType;
  };
}

export interface ReelViewEventDto {
  reelId: string;
  watchDurationSec: number;
  completed: boolean;
}

// ==========================================
// 5. Quizzes & Flashcards Contracts
// ==========================================

export interface QuizOptionDto {
  id: string;
  text: string;
}

export interface QuizQuestionDto {
  id: string;
  text: string;
  options: QuizOptionDto[];
  topicId: string;
  reelId?: string;
  explanation?: string;
}

export interface QuizDetailDto {
  topicId: string;
  topicTitle: string;
  questions: QuizQuestionDto[];
}

export interface QuizSubmissionAnswerDto {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizSubmissionRequestDto {
  topicId: string;
  answers: QuizSubmissionAnswerDto[];
}

export interface QuizQuestionResultDto {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizSubmissionResultDto {
  topicId: string;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  passed: boolean;
  results: QuizQuestionResultDto[];
  progressUpdated: boolean;
}

export interface FlashcardDto {
  id: string;
  topicId: string;
  frontQuestion: string;
  backAnswer: string;
  bullets?: string[];
}

// ==========================================
// 6. Progress & Bookmarks Contracts
// ==========================================

export interface TopicProgressDto {
  id: string;
  topicId: string;
  completionPercent: number;
  quizScore?: number;
  createdAt: string;
  updatedAt: string;
  topic: {
    id: string;
    title: string;
    difficulty: DifficultyLevel;
  };
  chapter: {
    id: string;
    title: string;
  };
  subject: {
    id: string;
    name: string;
    classLevel?: number;
    examType: ExamType;
  };
}

export interface UpdateProgressRequestDto {
  topicId: string;
  completionPercent: number;
}

export interface UserStatsDto {
  totalTopicsStudied: number;
  completedTopicsCount: number;
  totalReelsWatched: number;
  streakDays: number;
  averageQuizScore: number;
  activeExamType: ExamType;
}

export interface BookmarkDto {
  id: string;
  topicId: string;
  reelId?: string | null;
  createdAt: string;
  topic: {
    id: string;
    title: string;
    difficulty: DifficultyLevel;
  };
  chapter: {
    id: string;
    title: string;
  };
  subject: {
    id: string;
    name: string;
    classLevel?: number;
    examType: ExamType;
  };
}

export interface ToggleBookmarkRequestDto {
  topicId: string;
  reelId?: string | null;
}

export interface ToggleBookmarkResultDto {
  bookmarked: boolean;
  bookmark?: BookmarkDto;
}

// ==========================================
// 7. Feed, Community Trending & Analytics Contracts
// ==========================================

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

export interface ReelEngagementMetricsDto {
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
}

export interface ReelCommunityHighlightDto {
  authorName: string;
  authorBadge: string;
  topComment: string;
  upvotesCount: number;
  createdAt: string;
}

export interface ReelViewerStateDto {
  isLiked: boolean;
  isBookmarked: boolean;
  isWatched: boolean;
}

export interface TrendingReelDto extends ReelDto {
  rank: number;
  badge: TrendingBadgeType;
  badgeLabel: string;
  metrics: ReelEngagementMetricsDto;
  communityHighlight: ReelCommunityHighlightDto;
  viewerState?: ReelViewerStateDto;
}

export interface CommunityPulseStatsDto {
  activeLearnersNow: number;
  reelsWatchedToday: number;
  totalCommunityUpvotes: number;
  topTrendingSubject: string;
  avgCompletionRate: number;
}

export interface TrendingReelsQueryDto {
  sortBy?: TrendingReelSortBy;
  timeWindow?: TrendingTimeWindow;
  examType?: ExamType | string;
  cursor?: string;
  limit?: number;
}

export interface CommunityReelFeedResponseDto {
  items: TrendingReelDto[];
  communityPulse: CommunityPulseStatsDto;
  sortBy: TrendingReelSortBy;
  timeWindow: TrendingTimeWindow;
  nextCursor?: string | null;
}

export type ReelEngageActionType =
  | 'like'
  | 'unlike'
  | 'share'
  | 'rewatch'
  | 'bookmark';

export interface ReelEngageRequestDto {
  reelId: string;
  action: ReelEngageActionType;
}

export interface ReelEngageResponseDto {
  reelId: string;
  action: ReelEngageActionType;
  updatedLikesCount: number;
  updatedSharesCount: number;
  trendingScore: number;
}

export interface HomeFeedDto {
  subjectShortcuts: Array<{
    id: string;
    name: string;
    classLevel?: number;
    examType: ExamType;
  }>;
  continueLearning: TopicDetailDto[];
  recommended: TopicDetailDto[];
  quickRevision: TopicDetailDto[];
  trendingReels?: TrendingReelDto[];
}

export interface AnalyticsEventRequestDto {
  eventName: string;
  payload?: Record<string, any>;
  userId?: string;
}
