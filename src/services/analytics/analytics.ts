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

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export const analytics = {
  track(eventName: AnalyticsEventName, params?: AnalyticsParams) {
    // MVP: keep analytics provider mocked.
    // Swap to a real provider later (Amplitude/GA/etc).
    // eslint-disable-next-line no-console
    console.log('[analytics]', eventName, params ?? {});
  }
};

