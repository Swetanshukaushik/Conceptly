import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  BookmarkDto,
  ToggleBookmarkRequestDto,
  ToggleBookmarkResultDto,
  UserProfileDto,
} from '../../contracts';

@ApiTags('bookmarks')
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all saved bookmarks for the active user' })
  @ApiResponse({ status: 200 })
  async getUserBookmarks(@CurrentUser() user: UserProfileDto): Promise<BookmarkDto[]> {
    return this.bookmarksService.getUserBookmarks(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create or toggle bookmark for topic / reel' })
  @ApiResponse({ status: 201 })
  async createBookmark(
    @Body() dto: ToggleBookmarkRequestDto,
    @CurrentUser() user: UserProfileDto
  ): Promise<BookmarkDto> {
    const res = await this.bookmarksService.toggleBookmark(user.id, dto);
    if (res.bookmark) {
      return res.bookmark;
    }
    return {
      id: `unbookmarked-${dto.topicId}`,
      topicId: dto.topicId,
      reelId: dto.reelId,
      createdAt: new Date().toISOString(),
      topic: { id: dto.topicId, title: 'Topic', difficulty: 'medium' },
      chapter: { id: 'ch-general', title: 'Chapter' },
      subject: { id: 'sub-general', name: 'Subject', examType: 'TECH' },
    };
  }

  @Post('toggle')
  @ApiOperation({ summary: '1-tap toggle bookmark (add or remove) for topic / reel' })
  @ApiResponse({ status: 200 })
  async toggleBookmark(
    @Body() dto: ToggleBookmarkRequestDto,
    @CurrentUser() user: UserProfileDto
  ): Promise<ToggleBookmarkResultDto> {
    return this.bookmarksService.toggleBookmark(user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bookmark by id' })
  @ApiResponse({ status: 200 })
  async deleteBookmark(
    @Param('id') id: string,
    @CurrentUser() user: UserProfileDto
  ): Promise<{ deleted: boolean }> {
    return this.bookmarksService.deleteBookmark(user.id, id);
  }
}
