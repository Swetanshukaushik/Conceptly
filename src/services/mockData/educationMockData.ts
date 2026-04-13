import type {
  Chapter,
  ClassLevel,
  Subject,
  Topic
} from '@/types/education';
import type { Reel, ReelScene } from '@/types/reels';
import type { QuizQuestion } from '@/types/quiz';
import type { TopicProgress } from '@/types/progress';
import type { LanguageCode } from '@/types/i18n';
import type { ReelId, SubjectId, TopicId } from '@/types/ids';

import { CLASS_LEVELS, SUBJECTS } from '@/constants/education';

const L = (en: string, hi: string) =>
  ({ en, hi } as const satisfies Record<LanguageCode, string>);

const VIDEO_HOST = 'https://example.com/videos';
const THUMB_HOST = 'https://example.com/thumbs';

const CHAPTER_TITLES_BY_SUBJECT: Record<SubjectId, Array<{ title: { en: string; hi: string } }>> =
  {
    math: [
      { title: L('Fractions', 'भिन्न') },
      { title: L('Decimals', 'दशमलव') },
      { title: L('Integers', 'पूर्णांक') }
    ],
    science: [
      { title: L('Plants', 'पौधे') },
      { title: L('Materials', 'पदार्थ') },
      { title: L('Motion', 'गति') }
    ],
    english: [
      { title: L('Nouns', 'संज्ञा') },
      { title: L('Pronouns', 'सर्वनाम') },
      { title: L('Vocabulary', 'शब्द-भंडार') }
    ],
    social_science: [
      { title: L('Geography Basics', 'भूगोल की मूल बातें') },
      { title: L('History Timeline', 'इतिहास की समयरेखा') },
      { title: L('Civics Roles', 'नागरिकता की भूमिकाएं') }
    ],
    hindi: [
      { title: L('शब्द-भंडार', 'शब्द-भंडार') },
      { title: L('वाक्य-रचना', 'वाक्य-रचना') },
      { title: L('व्याकरण मूल बातें', 'व्याकरण मूल बातें') }
    ]
  };

const TOPIC_TEMPLATES_BY_CHAPTER: Array<{ en: string; hi: string }> = [
  { en: 'Understanding the concept', hi: 'अवधारणा समझना' },
  { en: 'Examples and patterns', hi: 'उदाहरण और पैटर्न' },
  { en: 'Quick practice', hi: 'त्वरित अभ्यास' }
];

function makeChapterId(classLevelId: number, subjectId: SubjectId, idx: number) {
  return `c-${classLevelId}-${subjectId}-${idx}` as const;
}

function makeTopicId(chapterId: string, idx: number) {
  return `${chapterId}-t-${idx}` as const;
}

function makeReelId(topicId: TopicId, idx: number) {
  return `${topicId}-r-${idx}` as const;
}

function makeQuizId(reelId: ReelId, idx: number) {
  return `${reelId}-q-${idx}` as const;
}

function makeLocalizedForSubject(
  subjectId: SubjectId,
  en: string,
  hi: string
): Record<LanguageCode, string> {
  // MVP: we reuse the provided strings; subjectId exists for future differentiation.
  void subjectId;
  return { en, hi };
}

const SCENE_CAPTIONS: Array<{ en: string; hi: string }> = [
  { en: 'Watch closely', hi: 'ध्यान से देखें' },
  { en: 'Learn the key idea', hi: 'मुख्य बात सीखें' },
  { en: 'Test yourself', hi: 'खुद से जांचें' }
];

function stablePercentFromId(id: string): number {
  // Deterministic "random" progress: 0..100.
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash % 101;
}

function buildDb() {
  const classLevels: ClassLevel[] = CLASS_LEVELS;
  const subjectsByClass: Record<number, Subject[]> = {};

  for (const c of classLevels) {
    subjectsByClass[c.id] = SUBJECTS;
  }

  const chapters: Chapter[] = [];
  const topics: Topic[] = [];
  const reels: Reel[] = [];
  const quizQuestionsByReel: Record<ReelId, QuizQuestion[]> = {};
  const topicProgressByTopicId: Record<TopicId, TopicProgress> = {};

  for (const classLevelId of classLevels.map((c) => c.id)) {
    for (const subject of SUBJECTS) {
      const chapterTitles = CHAPTER_TITLES_BY_SUBJECT[subject.id];

      for (let chapterIdx = 0; chapterIdx < chapterTitles.length; chapterIdx++) {
        const chapterId = makeChapterId(classLevelId, subject.id, chapterIdx);
        const chapterTitle = chapterTitles[chapterIdx].title;

        chapters.push({
          id: chapterId,
          classLevelId,
          subjectId: subject.id,
          title: chapterTitle,
          order: chapterIdx
        });

        for (let topicIdx = 0; topicIdx < TOPIC_TEMPLATES_BY_CHAPTER.length; topicIdx++) {
          const topicId = makeTopicId(chapterId, topicIdx);
          const topicTemplate = TOPIC_TEMPLATES_BY_CHAPTER[topicIdx];

          const difficulty: Topic['difficulty'] =
            (topicIdx + chapterIdx) % 3 === 0
              ? 'easy'
              : (topicIdx + chapterIdx) % 3 === 1
                ? 'medium'
                : 'hard';

          topics.push({
            id: topicId,
            chapterId,
            title: makeLocalizedForSubject(
              subject.id,
              topicTemplate.en,
              topicTemplate.hi
            ),
            estimatedReelCount: 2,
            difficulty,
            order: topicIdx
          });

          // Reels: 2 per topic
          for (let reelIdx = 0; reelIdx < 2; reelIdx++) {
            const reelId = makeReelId(topicId, reelIdx);
            const reelDifficulty: Reel['difficulty'] =
              reelIdx === 0 ? difficulty : difficulty === 'easy' ? 'medium' : difficulty;

            const scenes: ReelScene[] = SCENE_CAPTIONS.map((s, sceneIdx) => {
              const caption = makeLocalizedForSubject(
                subject.id,
                `${s.en}`,
                `${s.hi}`
              );

              return {
                id: `${reelId}-scene-${sceneIdx}`,
                caption,
                startSec: sceneIdx * 10,
                endSec: sceneIdx * 10 + 10
              };
            });

            const estimatedSeconds = reelIdx === 0 ? 90 : 120;
            const title = makeLocalizedForSubject(
              subject.id,
              `Reel ${reelIdx + 1}: ${topics.find((t) => t.id === topicId)?.title.en ?? 'Concept'}`,
              `रील ${reelIdx + 1}: ${topics.find((t) => t.id === topicId)?.title.hi ?? 'अवधारणा'}`
            );

            reels.push({
              id: reelId,
              topicId,
              classLevelId,
              subjectId: subject.id,
              order: reelIdx,
              title,
              subtitle: makeLocalizedForSubject(
                subject.id,
                'Short lesson + quick quiz',
                'छोटी सीख + क्विज'
              ),
              difficulty: reelDifficulty,
              estimatedSeconds,
              videoUrl: `${VIDEO_HOST}/${reelId}.mp4`,
              thumbnailUrl: `${THUMB_HOST}/${reelId}.jpg`,
              scenes
            });

            // 3-option MCQ quiz for each reel
            const quizId = makeQuizId(reelId, 0);
            const prompt = makeLocalizedForSubject(
              subject.id,
              'What is the main takeaway?',
              'मुख्य सीख क्या है?'
            );

            const correctIdx = (topicIdx + reelIdx) % 3;
            const options = ['A', 'B', 'C'].map((letter, optIdx) => ({
              id: `${quizId}-opt-${letter}`,
              label: makeLocalizedForSubject(
                subject.id,
                `Option ${letter} (${optIdx + 1})`,
                `विकल्प ${letter} (${optIdx + 1})`
              )
            }));

            const quizQuestions: QuizQuestion[] = [
              {
                id: `${quizId}-q0`,
                quizId,
                reelId,
                prompt,
                options,
                correctOptionId: options[correctIdx].id,
                explanation: makeLocalizedForSubject(
                  subject.id,
                  'Because it matches the key idea shown in the scenes.',
                  'क्योंकि यह दृश्यों में दिखी मुख्य बात से मेल खाता है।'
                )
              },
              {
                id: `${quizId}-q1`,
                quizId,
                reelId,
                prompt: makeLocalizedForSubject(
                  subject.id,
                  'Which example best fits?',
                  'कौन सा उदाहरण सही है?'
                ),
                options,
                correctOptionId: options[(correctIdx + 1) % 3].id
              },
              {
                id: `${quizId}-q2`,
                quizId,
                reelId,
                prompt: makeLocalizedForSubject(
                  subject.id,
                  'Choose the correct practice step.',
                  'सही अभ्यास कदम चुनें।'
                ),
                options,
                correctOptionId: options[(correctIdx + 2) % 3].id
              }
            ];

            quizQuestionsByReel[reelId] = quizQuestions;
          }

          topicProgressByTopicId[topicId] = {
            topicId,
            completionPercent: Math.min(
              100,
              Math.floor(stablePercentFromId(topicId) * 0.85)
            ),
            lastReelId: null,
            completedReelIds: []
          };
        }
      }
    }
  }

  return {
    classLevels,
    subjectsByClass,
    chapters,
    topics,
    reels,
    quizQuestionsByReel,
    topicProgressByTopicId
  };
}

export const educationMockDb = buildDb();

