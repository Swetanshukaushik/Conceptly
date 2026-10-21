import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  BookmarkDto,
  ToggleBookmarkRequestDto,
  ToggleBookmarkResultDto,
  DifficultyLevel,
} from '../../contracts';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  private mapBookmarkToDto(b: any): BookmarkDto {
    return {
      id: b.id,
      topicId: b.topicId,
      reelId: b.reelId ?? undefined,
      createdAt: b.createdAt.toISOString(),
      topic: {
        id: b.topic.id,
        title: b.topic.title,
        difficulty: (b.topic.difficulty as DifficultyLevel) || 'medium',
      },
      chapter: {
        id: b.topic.chapter.id,
        title: b.topic.chapter.titleEn,
      },
      subject: {
        id: b.topic.chapter.subject.id,
        name: b.topic.chapter.subject.name,
        classLevel: b.topic.chapter.subject.classLevel ?? undefined,
        examType: b.topic.chapter.subject.examType as any,
      },
    };
  }

  async getUserBookmarks(userId: string): Promise<BookmarkDto[]> {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      include: {
        topic: {
          include: {
            chapter: {
              include: { subject: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookmarks.map((b) => this.mapBookmarkToDto(b));
  }

  async toggleBookmark(
    userId: string,
    dto: ToggleBookmarkRequestDto
  ): Promise<ToggleBookmarkResultDto> {
    const reelId = dto.reelId || null;

    const existing = await this.prisma.bookmark.findFirst({
      where: {
        userId,
        topicId: dto.topicId,
        reelId,
      },
    });

    if (existing) {
      await this.prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return {
        bookmarked: false,
      };
    }

    const created = await this.prisma.bookmark.create({
      data: {
        userId,
        topicId: dto.topicId,
        reelId,
      },
      include: {
        topic: {
          include: {
            chapter: {
              include: { subject: true },
            },
          },
        },
      },
    });

    return {
      bookmarked: true,
      bookmark: this.mapBookmarkToDto(created),
    };
  }

  async deleteBookmark(userId: string, bookmarkId: string): Promise<{ deleted: boolean }> {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });

    if (!bookmark) {
      throw new NotFoundException(`Bookmark not found for id: ${bookmarkId}`);
    }

    await this.prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return { deleted: true };
  }
}
