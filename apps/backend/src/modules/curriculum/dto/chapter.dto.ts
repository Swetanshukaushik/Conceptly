import { ApiProperty } from '@nestjs/swagger';

export class ChapterDto {
  @ApiProperty({ example: 'math-7-chapter-1' })
  id: string;

  @ApiProperty({ example: 'Number Systems' })
  title: string;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: 5 })
  topicCount: number;
}
