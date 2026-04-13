// Shared, stable types across mobile and backend.
// Keep this focused on contracts and enums, not business logic.

export type Difficulty = 'easy' | 'medium' | 'hard';

export type AnalyticsEventName =
  | 'app_opened'
  | 'onboarding_completed'
  | 'class_selected'
  | 'subject_selected'
  | 'chapter_selected'
  | 'topic_viewed'
  | 'reel_viewed'
  | 'reel_completed'
  | 'quiz_started'
  | 'quiz_completed'
  | 'topic_bookmarked';

