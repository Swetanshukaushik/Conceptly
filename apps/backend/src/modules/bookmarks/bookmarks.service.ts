import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { BookmarkDto } from './dto/bookmark.dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserBookmarks(): Promise<BookmarkDto[]> {
    // For MVP, assume user ID is hardcoded (would come from auth in real app)
    const userId = 'student@example.com';

    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      include: {
        topic: {
          include: {
            chapter: {
              include: { subject: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return bookmarks.map((bookmark) => ({
      id: bookmark.id,
      topicId: bookmark.topicId,
      reelId: bookmark.reelId,
      createdAt: bookmark.createdAt,
      topic: {
        id: bookmark.topic.id,
        title: bookmark.topic.title,
        difficulty: bookmark.topic.difficulty
      },
      chapter: {
        id: bookmark.topic.chapter.id,
        title: bookmark.topic.chapter.title
      },
      subject: {
        id: bookmark.topic.chapter.subject.id,
        name: bookmark.topic.chapter.subject.name,
        classLevel: bookmark.topic.chapter.subject.classLevel
      }
    }));
  }

  async createBookmark(createBookmarkDto: CreateBookmarkDto): Promise<BookmarkDto> {
    // For MVP, assume user ID is hardcoded (would come from auth in real app)
    const userId = 'student@example.com';

    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        topicId: createBookmarkDto.topicId,
        reelId: createBookmarkDto.reelId
      },
      include: {
        topic: {
          include: {
            chapter: {
              include: { subject: true }
            }
          }
        }
      }
    });

    return {
      id: bookmark.id,
      topicId: bookmark.topicId,
      reelId: bookmark.reelId,
      createdAt: bookmark.createdAt,
      topic: {
        id: bookmark.topic.id,
        title: bookmark.topic.title,
        difficulty: bookmark.topic.difficulty
      },
      chapter: {
        id: bookmark.topic.chapter.id,
        title: bookmark.topic.chapter.title
      },
      subject: {
        id: bookmark.topic.chapter.subject.id,
        name: bookmark.topic.chapter.subject.name,
        classLevel: bookmark.topic.chapter.subject.classLevel
      }
    };
  }

  async deleteBookmark(bookmarkId: string): Promise<BookmarkDto> {
    // For MVP, assume user ID is hardcoded (would come from auth in real app)
    const userId = 'student@example.com';

    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId }
    });

    if (!bookmark) {
      throw new NotFoundException(`Bookmark not found for id: ${bookmarkId}`);
    }

    await this.prisma.bookmark.delete({
      where: { id: bookmarkId }
    });

    // Return the deleted bookmark data
    const topic = await this.prisma.topic.findUnique({
      where: { id: bookmark.topicId },
      include: {
        chapter: {
          include: { subject: true }
        }
      }
    });

    if (!topic) {
      throw new NotFoundException(`Topic not found for bookmark: ${bookmarkId}`);
    }

    return {
      id: bookmark.id,
      topicId: bookmark.topicId,
      reelId: bookmark.reelId,
      createdAt: bookmark.createdAt,
      topic: {
        id: topic.id,
        title: topic.title,
        difficulty: topic.difficulty
      },
      chapter: {
        id: topic.chapter.id,
        title: topic.chapter.title
      },
      subject: {
        id: topic.chapter.subject.id,
        name: topic.chapter.subject.name,
        classLevel: topic.chapter.subject.classLevel
      }
    };
  }
}
