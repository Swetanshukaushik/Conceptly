import { ApiProperty } from '@nestjs/swagger';

export class SubjectSummaryDto {
  @ApiProperty({ example: 'math-7' })
  id: string;

  @ApiProperty({ example: 'Mathematics' })
  name: string;

  @ApiProperty({ example: 7, required: false })
  classLevel?: number;

  @ApiProperty({ example: 3 })
  chapterCount: number;
}
