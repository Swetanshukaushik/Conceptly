import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { HomeFeedDto } from './dto/home-feed.dto';

@ApiTags('feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('home')
  @ApiOkResponse({ type: HomeFeedDto })
  async getHomeFeed(
    @Query('examType') examType?: string,
    @Query('classLevel') classLevel?: string
  ) {
    const level = classLevel ? Number(classLevel) : undefined;
    return this.feedService.getHomeFeed(examType, level);
  }
}
