import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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

export class BookmarkDto {
  @ApiProperty({ example: 'bookmark-1' })
  id: string;

  @ApiProperty({ example: 'math-7-topic-1' })
  topicId: string;

  @ApiProperty({ example: 'math-7-reel-1', nullable: true })
  reelId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: TopicReference })
  topic: TopicReference;

  @ApiProperty({ type: ChapterReference })
  chapter: ChapterReference;

  @ApiProperty({ type: SubjectReference })
  subject: SubjectReference;
}

export class CreateBookmarkDto {
  @IsString()
  @ApiProperty({ example: 'math-7-topic-1' })
  topicId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'math-7-reel-1', required: false })
  reelId?: string;
}
