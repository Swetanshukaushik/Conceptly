import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(createEventDto: CreateAnalyticsEventDto): Promise<void> {
    // For MVP, assume user ID is hardcoded (would come from auth in real app)
    const userId = createEventDto.userId || 'student@example.com';

    await this.prisma.analyticsEvent.create({
      data: {
        userId,
        eventName: createEventDto.eventName,
        payload: JSON.stringify(createEventDto.payload || {})
      }
    });
  }
}
