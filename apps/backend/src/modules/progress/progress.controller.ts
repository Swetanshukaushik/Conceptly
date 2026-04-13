import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { TopicProgressDto } from './dto/topic-progress.dto';
import { CreateProgressDto } from './dto/create-progress.dto';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiOkResponse({ type: [TopicProgressDto] })
  async getUserProgress() {
    return this.progressService.getUserProgress();
  }

  @Post()
  @ApiOkResponse({ type: TopicProgressDto })
  async updateProgress(@Body() createProgressDto: CreateProgressDto) {
    return this.progressService.updateProgress(createProgressDto);
  }
}
