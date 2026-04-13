import type { ChapterDto, ClassLevelDto, SubjectDto, ReelDto } from './types';

export const mockClasses: ClassLevelDto[] = [
  { id: 6, label: { en: 'Class 6', hi: 'कक्षा 6' } },
  { id: 7, label: { en: 'Class 7', hi: 'कक्षा 7' } },
  { id: 8, label: { en: 'Class 8', hi: 'कक्षा 8' } }
];

export const mockSubjectsByClass: Record<number, SubjectDto[]> = {
  6: [
    { id: 'math', label: { en: 'Mathematics', hi: 'गणित' } },
    { id: 'science', label: { en: 'Science', hi: 'विज्ञान' } }
  ],
  7: [
    { id: 'math', label: { en: 'Mathematics', hi: 'गणित' } },
    { id: 'science', label: { en: 'Science', hi: 'विज्ञान' } }
  ],
  8: [
    { id: 'math', label: { en: 'Mathematics', hi: 'गणित' } },
    { id: 'science', label: { en: 'Science', hi: 'विज्ञान' } }
  ]
};

export const mockChaptersBySubject: Record<string, ChapterDto[]> = {
  math: [
    {
      id: 'fractions',
      subjectId: 'math',
      title: { en: 'Fractions', hi: 'भिन्न' }
    },
    {
      id: 'decimals',
      subjectId: 'math',
      title: { en: 'Decimals', hi: 'दशमलव' }
    }
  ],
  science: [
    {
      id: 'plants',
      subjectId: 'science',
      title: { en: 'Plants', hi: 'पौधे' }
    },
    {
      id: 'motion',
      subjectId: 'science',
      title: { en: 'Motion', hi: 'गति' }
    }
  ]
};

// Mock topics for testing
export const mockTopics: TopicDto[] = [
  {
    id: 'fractions-intro',
    title: 'Introduction to Fractions',
    difficulty: 'Easy',
    chapterId: 'fractions',
    reelCount: 2
  },
  {
    id: 'decimal-basics',
    title: 'Decimal Numbers Basics',
    difficulty: 'Easy',
    chapterId: 'decimals',
    reelCount: 1
  },
  {
    id: 'plant-parts',
    title: 'Parts of a Plant',
    difficulty: 'Easy',
    chapterId: 'plants',
    reelCount: 1
  },
  {
    id: 'newtons-laws',
    title: 'Newton\'s Laws of Motion',
    difficulty: 'Medium',
    chapterId: 'motion',
    reelCount: 1
  }
];

export const mockTopicDetails: TopicDetailDto[] = [
  {
    id: 'fractions-intro',
    title: 'Introduction to Fractions',
    difficulty: 'Easy',
    chapterId: 'fractions',
    reelCount: 2,
    chapter: { id: 'fractions', title: 'Fractions' },
    subject: { id: 'math', name: 'Mathematics', classLevel: 6 }
  },
  {
    id: 'decimal-basics',
    title: 'Decimal Numbers Basics',
    difficulty: 'Easy',
    chapterId: 'decimals',
    reelCount: 1,
    chapter: { id: 'decimals', title: 'Decimals' },
    subject: { id: 'math', name: 'Mathematics', classLevel: 7 }
  },
  {
    id: 'plant-parts',
    title: 'Parts of a Plant',
    difficulty: 'Easy',
    chapterId: 'plants',
    reelCount: 1,
    chapter: { id: 'plants', title: 'Plants' },
    subject: { id: 'science', name: 'Science', classLevel: 6 }
  },
  {
    id: 'newtons-laws',
    title: 'Newton\'s Laws of Motion',
    difficulty: 'Medium',
    chapterId: 'motion',
    reelCount: 1,
    chapter: { id: 'motion', title: 'Motion' },
    subject: { id: 'science', name: 'Science', classLevel: 8 }
  }
];

export const mockReels: ReelDto[] = [
  {
    id: 'reel-fractions-1',
    title: 'What are Fractions?',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    durationSec: 45,
    topicId: 'fractions-intro',
    topic: {
      id: 'fractions-intro',
      title: 'Introduction to Fractions',
      difficulty: 'Easy'
    },
    chapter: {
      id: 'fractions',
      title: 'Fractions'
    },
    subject: {
      id: 'math',
      name: 'Mathematics',
      classLevel: 6
    }
  },
  {
    id: 'reel-fractions-2',
    title: 'Adding Fractions',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    durationSec: 62,
    topicId: 'fractions-intro',
    topic: {
      id: 'fractions-intro',
      title: 'Introduction to Fractions',
      difficulty: 'Easy'
    },
    chapter: {
      id: 'fractions',
      title: 'Fractions'
    },
    subject: {
      id: 'math',
      name: 'Mathematics',
      classLevel: 6
    }
  },
  {
    id: 'reel-decimals-1',
    title: 'Understanding Decimals',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSec: 38,
    topicId: 'decimal-basics',
    topic: {
      id: 'decimal-basics',
      title: 'Decimal Numbers Basics',
      difficulty: 'Easy'
    },
    chapter: {
      id: 'decimals',
      title: 'Decimals'
    },
    subject: {
      id: 'math',
      name: 'Mathematics',
      classLevel: 7
    }
  },
  {
    id: 'reel-plants-1',
    title: 'Plant Cell Structure',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    durationSec: 55,
    topicId: 'plant-parts',
    topic: {
      id: 'plant-parts',
      title: 'Parts of a Plant',
      difficulty: 'Easy'
    },
    chapter: {
      id: 'plants',
      title: 'Plants'
    },
    subject: {
      id: 'science',
      name: 'Science',
      classLevel: 6
    }
  },
  {
    id: 'reel-motion-1',
    title: 'First Law of Motion',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    durationSec: 48,
    topicId: 'newtons-laws',
    topic: {
      id: 'newtons-laws',
      title: 'Newton\'s Laws of Motion',
      difficulty: 'Medium'
    },
    chapter: {
      id: 'motion',
      title: 'Motion'
    },
    subject: {
      id: 'science',
      name: 'Science',
      classLevel: 8
    }
  }
];

// Mock home feed data
export const mockHomeFeed = {
  subjectShortcuts: [
    { id: 'math', name: 'Mathematics', classLevel: 6 },
    { id: 'science', name: 'Science', classLevel: 6 }
  ],
  continueLearning: mockTopicDetails.slice(0, 2),
  recommended: mockTopicDetails.slice(2, 4),
  quickRevision: mockTopicDetails.slice(0, 1)
};

// Mock quiz data
export const mockQuizzes: Record<string, QuizDto> = {
  'fractions-intro': {
    topicId: 'fractions-intro',
    topicTitle: 'Introduction to Fractions',
    questions: [
      {
        id: 'q1',
        question: 'What is a fraction?',
        options: [
          { id: 'a', text: 'A whole number' },
          { id: 'b', text: 'A part of a whole' },
          { id: 'c', text: 'A decimal number' },
          { id: 'd', text: 'An integer' }
        ],
        correctOptionId: 'b',
        topicId: 'fractions-intro'
      },
      {
        id: 'q2',
        question: 'What does the numerator represent in a fraction?',
        options: [
          { id: 'a', text: 'The total parts' },
          { id: 'b', text: 'The parts we have' },
          { id: 'c', text: 'The denominator' },
          { id: 'd', text: 'The whole number' }
        ],
        correctOptionId: 'b',
        topicId: 'fractions-intro'
      }
    ]
  },
  'decimal-basics': {
    topicId: 'decimal-basics',
    topicTitle: 'Decimal Numbers Basics',
    questions: [
      {
        id: 'q1',
        question: 'What is a decimal point?',
        options: [
          { id: 'a', text: 'A point that separates whole numbers from fractions' },
          { id: 'b', text: 'A point used in multiplication' },
          { id: 'c', text: 'A point for addition' },
          { id: 'd', text: 'A point for subtraction' }
        ],
        correctOptionId: 'a',
        topicId: 'decimal-basics'
      }
    ]
  }
};

