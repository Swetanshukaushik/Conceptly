import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAnalyticsEventDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'student@example.com', required: false })
  userId?: string;

  @IsString()
  @ApiProperty({ example: 'reel_viewed' })
  eventName: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({ example: { reelId: 'math-7-reel-1', duration: 30 }, required: false })
  payload?: Record<string, any>;
}
