import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBookmarkDto {
  @IsString()
  @ApiProperty({ example: 'math-7-topic-1' })
  topicId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'math-7-reel-1', required: false })
  reelId?: string;
}
