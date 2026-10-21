import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  TopicProgressDto,
  UpdateProgressRequestDto,
  UserProfileDto,
} from '../../contracts';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Get topic progress records for the active user' })
  @ApiResponse({ status: 200 })
  async getUserProgress(@CurrentUser() user: UserProfileDto): Promise<TopicProgressDto[]> {
    return this.progressService.getUserProgress(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Update completion percentage for a topic' })
  @ApiResponse({ status: 200 })
  async updateProgress(
    @Body() dto: UpdateProgressRequestDto,
    @CurrentUser() user: UserProfileDto
  ): Promise<TopicProgressDto> {
    return this.progressService.updateProgress(user.id, dto);
  }
}
