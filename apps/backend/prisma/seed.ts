import { PrismaClient, ExamType } from '@prisma/client';

type SeedSubject = {
  id: string;
  name: string;
  examType: ExamType;
  classLevel?: number;
};

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      displayName: 'Conceptly Learner',
      classLevel: 7,
      language: 'en'
    }
  });

  const subjects: SeedSubject[] = [
    // School subjects
    { id: 'mathematics-7', name: 'Mathematics', examType: 'SCHOOL', classLevel: 7 },
    { id: 'science-7', name: 'Science', examType: 'SCHOOL', classLevel: 7 },
    { id: 'english-7', name: 'English', examType: 'SCHOOL', classLevel: 7 },
    // UPSC subjects
    { id: 'upsc-polity', name: 'Polity', examType: 'UPSC' },
    { id: 'upsc-history', name: 'History', examType: 'UPSC' },
    { id: 'upsc-geography', name: 'Geography', examType: 'UPSC' },
    { id: 'upsc-economy', name: 'Economy', examType: 'UPSC' },
    // IIT JEE subjects
    { id: 'jee-physics', name: 'Physics', examType: 'IIT_JEE' },
    { id: 'jee-chemistry', name: 'Chemistry', examType: 'IIT_JEE' },
    { id: 'jee-mathematics', name: 'Mathematics', examType: 'IIT_JEE' },
    // NEET subjects
    { id: 'neet-physics', name: 'Physics', examType: 'NEET' },
    { id: 'neet-chemistry', name: 'Chemistry', examType: 'NEET' },
    { id: 'neet-biology', name: 'Biology', examType: 'NEET' }
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { id: subject.id },
      update: {
        name: subject.name,
        examType: subject.examType,
        classLevel: subject.classLevel
      },
      create: subject
    });
  }

  const chapters = [
    { id: 'math-7-chapter-1', subjectId: 'mathematics-7', title: 'Number Systems', order: 1 },
    { id: 'math-7-chapter-2', subjectId: 'mathematics-7', title: 'Algebra Basics', order: 2 },
    { id: 'science-7-chapter-1', subjectId: 'science-7', title: 'Nutrition and Life', order: 1 },
    { id: 'science-7-chapter-2', subjectId: 'science-7', title: 'Force and Motion', order: 2 },
    { id: 'english-7-chapter-1', subjectId: 'english-7', title: 'Reading Comprehension', order: 1 }
  ];

  for (const chapter of chapters) {
    await prisma.chapter.upsert({
      where: { id: chapter.id },
      update: { title: chapter.title, order: chapter.order },
      create: chapter
    });
  }

  const topics = [
    {
      id: 'math-7-topic-1',
      chapterId: 'math-7-chapter-1',
      title: 'Integers and Whole Numbers',
      difficulty: 'medium'
    },
    {
      id: 'math-7-topic-2',
      chapterId: 'math-7-chapter-1',
      title: 'Fractions and Decimals',
      difficulty: 'medium'
    },
    {
      id: 'math-7-topic-3',
      chapterId: 'math-7-chapter-2',
      title: 'Simple Equations',
      difficulty: 'hard'
    },
    {
      id: 'science-7-topic-1',
      chapterId: 'science-7-chapter-1',
      title: 'Nutrition in Plants and Animals',
      difficulty: 'easy'
    },
    {
      id: 'science-7-topic-2',
      chapterId: 'science-7-chapter-2',
      title: 'Moving Things and Measurement',
      difficulty: 'medium'
    },
    {
      id: 'english-7-topic-1',
      chapterId: 'english-7-chapter-1',
      title: 'Understanding Passage Meaning',
      difficulty: 'easy'
    }
  ];

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { id: topic.id },
      update: { title: topic.title, difficulty: topic.difficulty },
      create: topic
    });
  }

  const reels = [
    {
      id: 'math-7-reel-1',
      topicId: 'math-7-topic-1',
      title: 'Integers: What They Are',
      videoUrl: 'https://example.com/video/math-7-1.mp4',
      durationSec: 52
    },
    {
      id: 'math-7-reel-2',
      topicId: 'math-7-topic-1',
      title: 'Integer Rules and Examples',
      videoUrl: 'https://example.com/video/math-7-2.mp4',
      durationSec: 48
    },
    {
      id: 'science-7-reel-1',
      topicId: 'science-7-topic-1',
      title: 'Plant Nutrition Simplified',
      videoUrl: 'https://example.com/video/science-7-1.mp4',
      durationSec: 60
    }
  ];

  for (const reel of reels) {
    await prisma.reel.upsert({
      where: { id: reel.id },
      update: { title: reel.title, videoUrl: reel.videoUrl, durationSec: reel.durationSec },
      create: reel
    });
  }

  const quizQuestions = [
    {
      id: 'quiz-1',
      reelId: 'math-7-reel-1',
      prompt: 'Which of these is an integer?',
      optionsJson: JSON.stringify(['2.5', '−3', '1/2', 'π']),
      answerKey: '−3'
    }
  ];

  for (const quizQuestion of quizQuestions) {
    await prisma.quizQuestion.upsert({
      where: { id: quizQuestion.id },
      update: {
        prompt: quizQuestion.prompt,
        optionsJson: quizQuestion.optionsJson,
        answerKey: quizQuestion.answerKey
      },
      create: quizQuestion
    });
  }

  console.log('Seed complete for Conceptly backend');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
