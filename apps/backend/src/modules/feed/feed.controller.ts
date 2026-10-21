import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { HomeFeedDto, UserProfileDto } from '../../contracts';

@ApiTags('feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  @ApiOperation({ summary: 'Get home feed based on target track, progress, and recommendations' })
  @ApiResponse({ status: 200 })
  async getHomeFeed(
    @CurrentUser() user: UserProfileDto,
    @Query('examType') examType?: string,
    @Query('classLevel') classLevel?: string
  ): Promise<HomeFeedDto> {
    const activeExamType = examType || user.examType || 'TECH';
    const activeClassLevel = classLevel ? parseInt(classLevel, 10) : user.classLevel ?? undefined;
    return this.feedService.getHomeFeed(user.id, activeExamType, activeClassLevel);
  }
}
