import { ApiProperty } from '@nestjs/swagger';

class SubjectShortcutDto {
  @ApiProperty({ example: 'math-7' })
  id: string;

  @ApiProperty({ example: 'Mathematics' })
  name: string;

  @ApiProperty({ example: 7 })
  classLevel: number;
}

class FeedTopicDto {
  @ApiProperty({ example: 'math-7-topic-1' })
  id: string;

  @ApiProperty({ example: 'Integers and Whole Numbers' })
  title: string;

  @ApiProperty({ example: 'medium' })
  difficulty: string;

  @ApiProperty({ example: 2 })
  reelCount: number;

  @ApiProperty({ type: Object })
  chapter: {
    id: string;
    title: string;
  };

  @ApiProperty({ type: Object })
  subject: {
    id: string;
    name: string;
    classLevel: number;
  };
}

export class HomeFeedDto {
  @ApiProperty({ type: [SubjectShortcutDto] })
  subjectShortcuts: SubjectShortcutDto[];

  @ApiProperty({ type: [FeedTopicDto] })
  continueLearning: FeedTopicDto[];

  @ApiProperty({ type: [FeedTopicDto] })
  recommended: FeedTopicDto[];

  @ApiProperty({ type: [FeedTopicDto] })
  quickRevision: FeedTopicDto[];
}
