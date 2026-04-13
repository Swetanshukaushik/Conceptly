import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { BookmarkDto } from './dto/bookmark.dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@ApiTags('bookmarks')
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  @ApiOkResponse({ type: [BookmarkDto] })
  async getUserBookmarks() {
    return this.bookmarksService.getUserBookmarks();
  }

  @Post()
  @ApiOkResponse({ type: BookmarkDto })
  async createBookmark(@Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksService.createBookmark(createBookmarkDto);
  }

  @Delete(':bookmarkId')
  @ApiOkResponse({ type: BookmarkDto })
  async deleteBookmark(@Param('bookmarkId') bookmarkId: string) {
    return this.bookmarksService.deleteBookmark(bookmarkId);
  }
}
