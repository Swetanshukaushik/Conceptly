import { ApiProperty } from '@nestjs/swagger';

class TopicReference {
  @ApiProperty({ example: 'math-7-topic-1' })
  id: string;

  @ApiProperty({ example: 'Integers and Whole Numbers' })
  title: string;

  @ApiProperty({ example: 'medium' })
  difficulty: string;
}

class ChapterReference {
  @ApiProperty({ example: 'math-7-chapter-1' })
  id: string;

  @ApiProperty({ example: 'Number Systems' })
  title: string;
}

class SubjectReference {
  @ApiProperty({ example: 'math-7' })
  id: string;

  @ApiProperty({ example: 'Mathematics' })
  name: string;

  @ApiProperty({ example: 7 })
  classLevel: number;
}

export class ReelDto {
  @ApiProperty({ example: 'math-7-reel-1' })
  id: string;

  @ApiProperty({ example: 'Integers: What They Are' })
  title: string;

  @ApiProperty({ example: 'https://example.com/video/math-7-1.mp4' })
  videoUrl: string;

  @ApiProperty({ example: 52 })
  durationSec: number;

  @ApiProperty({ example: 'math-7-topic-1' })
  topicId: string;

  @ApiProperty({ type: TopicReference })
  topic: TopicReference;

  @ApiProperty({ type: ChapterReference })
  chapter: ChapterReference;

  @ApiProperty({ type: SubjectReference })
  subject: SubjectReference;
}
