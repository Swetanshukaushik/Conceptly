import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateProgressDto {
  @IsString()
  @ApiProperty({ example: 'math-7-topic-1' })
  topicId: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @ApiProperty({ example: 75 })
  completionPercent: number;
}
