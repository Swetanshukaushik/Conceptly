import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReelsService } from './reels.service';
import { ReelDto } from './dto/reel.dto';

@ApiTags('reels')
@Controller('topics/:topicId/reels')
export class ReelsController {
  constructor(private readonly reelsService: ReelsService) {}

  @Get()
  @ApiOkResponse({ type: [ReelDto] })
  async getReelsByTopic(@Param('topicId') topicId: string) {
    return this.reelsService.getReelsByTopic(topicId);
  }
}

@ApiTags('reels')
@Controller('reels')
export class ReelController {
  constructor(private readonly reelsService: ReelsService) {}

  @Get(':id')
  @ApiOkResponse({ type: ReelDto })
  async getReelById(@Param('id') id: string) {
    return this.reelsService.getReelById(id);
  }
}
