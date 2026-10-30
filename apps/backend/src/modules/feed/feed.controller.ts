import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  CommunityReelFeedResponseDto,
  HomeFeedDto,
  ReelEngageRequestDto,
  ReelEngageResponseDto,
  TrendingReelSortBy,
  TrendingTimeWindow,
  UserProfileDto,
} from '../../contracts';

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

  @Get('trending')
  @ApiOperation({
    summary: 'Get community trending & top-grossing reels ranked by Bayesian time-decayed velocity',
  })
  @ApiResponse({ status: 200 })
  async getTrendingReels(
    @CurrentUser() user: UserProfileDto,
    @Query('sortBy') sortBy?: TrendingReelSortBy,
    @Query('timeWindow') timeWindow?: TrendingTimeWindow,
    @Query('examType') examType?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string
  ): Promise<CommunityReelFeedResponseDto> {
    return this.feedService.getTrendingReels(user.id, {
      sortBy: sortBy ?? 'trending',
      timeWindow: timeWindow ?? '24h',
      examType: (examType as any) ?? undefined,
      cursor,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Post('reels/:id/engage')
  @ApiOperation({
    summary: 'Record community engagement event (like, unlike, share, rewatch) for real-time velocity ranking',
  })
  @ApiResponse({ status: 200 })
  async engageWithReel(
    @CurrentUser() user: UserProfileDto,
    @Param('id') reelId: string,
    @Body() body: Partial<ReelEngageRequestDto>
  ): Promise<ReelEngageResponseDto> {
    return this.feedService.engageWithReel(user.id, reelId, body.action ?? 'like');
  }
}
