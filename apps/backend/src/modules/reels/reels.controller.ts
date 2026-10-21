import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReelsService } from './reels.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { ReelDto, ReelViewEventDto, UserProfileDto } from '../../contracts';

@ApiTags('reels')
@Controller()
export class ReelsController {
  constructor(private readonly reelsService: ReelsService) {}

  @Get('topics/:topicId/reels')
  @ApiOperation({ summary: 'Get all visual reels for a topic' })
  @ApiResponse({ status: 200 })
  async getReelsByTopic(@Param('topicId') topicId: string): Promise<ReelDto[]> {
    return this.reelsService.getReelsByTopic(topicId);
  }

  @Get('reels/:id')
  @ApiOperation({ summary: 'Get a single reel with whiteboard flow & pitch script' })
  @ApiResponse({ status: 200 })
  async getReelById(@Param('id') id: string): Promise<ReelDto> {
    return this.reelsService.getReelById(id);
  }

  @Post('reels/:id/view')
  @ApiOperation({ summary: 'Record watch completion event for active progress tracking' })
  @ApiResponse({ status: 200 })
  async recordReelView(
    @Param('id') id: string,
    @Body() body: ReelViewEventDto,
    @CurrentUser() user: UserProfileDto
  ): Promise<{ status: string }> {
    return this.reelsService.recordReelView(user.id, id, body);
  }
}
