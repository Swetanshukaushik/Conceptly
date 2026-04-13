import { Controller, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';

@ApiTags('analytics')
@Controller('analytics/events')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  @ApiOkResponse({ type: CreateAnalyticsEventDto })
  async createEvent(@Body() createEventDto: CreateAnalyticsEventDto) {
    return this.analyticsService.createEvent(createEventDto);
  }
}
