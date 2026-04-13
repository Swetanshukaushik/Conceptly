import type { HomeFeed } from '@/types/feed';
import type { ClassLevelId, SubjectId } from '@/types/ids';

import { toFeedItemFromReel } from '@/types/feed';
import { educationMockDb } from '@/services/mockData/educationMockData';

const L = (en: string, hi: string) => ({ en, hi } as const);

export async function getHomeFeedForSubjectMock(args: {
  classLevelId: number;
  subjectId: string;
}): Promise<HomeFeed> {
  const { classLevelId, subjectId } = args;

  const chapters = educationMockDb.chapters
    .filter((c) => c.classLevelId === classLevelId && c.subjectId === subjectId)
    .sort((a, b) => a.order - b.order);

  const topics = chapters.flatMap((c) =>
    educationMockDb.topics
      .filter((t) => t.chapterId === c.id)
      .sort((a, b) => a.order - b.order)
  );

  const chosenTopics = topics.slice(0, 4);

  const reelsByTopic = chosenTopics.map((t) =>
    educationMockDb.reels
      .filter((r) => r.topicId === t.id)
      .sort((a, b) => a.order - b.order)
  );

  const continueTopic = chosenTopics[0];
  const continueReel = reelsByTopic[0]?.[0];

  const pairs: Array<{
    topicId: string;
    reelId: string;
    reel: (typeof educationMockDb.reels)[number];
    topic: (typeof educationMockDb.topics)[number];
  }> = [];

  for (let i = 0; i < chosenTopics.length; i++) {
    for (const reel of reelsByTopic[i] ?? []) {
      pairs.push({
        topicId: chosenTopics[i].id,
        reelId: reel.id,
        reel,
        topic: chosenTopics[i]
      });
    }
  }

  const recommendedItems = pairs.slice(1, 4);
  const revisionItems = pairs.slice(2, 4);

  return {
    classLevelId: classLevelId as ClassLevelId,
    subjectId: subjectId as SubjectId,
    sections: [
      {
        id: 'continue',
        title: L('Continue learning', 'सीख जारी रखें'),
        subtitle: L('Based on your last session', 'आपके पिछले सेशंस के आधार पर'),
        items:
          continueTopic && continueReel
            ? [toFeedItemFromReel({ reel: continueReel, topic: continueTopic })]
            : []
      },
      {
        id: 'recommended',
        title: L('Recommended for you', 'आपके लिए सुझाव'),
        items: recommendedItems.map(({ reel, topic }) =>
          toFeedItemFromReel({ reel, topic })
        )
      },
      {
        id: 'revision',
        title: L('Quick revision', 'त्वरित पुनरावृत्ति'),
        subtitle: L('High-impact concepts', 'मुख्य अवधारणाएं'),
        items: revisionItems.map(({ reel, topic }) =>
          toFeedItemFromReel({ reel, topic })
        )
      }
    ]
  };
}

