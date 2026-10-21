import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurriculumService } from './curriculum.service';
import {
  ExamTypeInfoDto,
  ClassLevelDto,
  SubjectSummaryDto,
  ChapterSummaryDto,
  TopicSummaryDto,
  TopicDetailDto,
  FlashcardDto,
} from '../../contracts';

@ApiTags('curriculum')
@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get('exam-types')
  @ApiOperation({ summary: 'Get all 7 supported exam and career tracks' })
  @ApiResponse({ status: 200 })
  async getExamTypes(): Promise<ExamTypeInfoDto[]> {
    return this.curriculumService.getExamTypes();
  }

  @Get('classes')
  @ApiOperation({ summary: 'Get available school class levels' })
  @ApiResponse({ status: 200 })
  async getClassLevels(): Promise<ClassLevelDto[]> {
    return this.curriculumService.getClassLevels();
  }

  @Get('classes/:classLevel/subjects')
  @ApiOperation({ summary: 'Get subjects for a school class level' })
  @ApiResponse({ status: 200 })
  async getSubjectsByClassLevel(
    @Param('classLevel', ParseIntPipe) classLevel: number
  ): Promise<SubjectSummaryDto[]> {
    return this.curriculumService.getSubjectsByClassLevel(classLevel);
  }

  @Get('exam-types/:examType/subjects')
  @ApiOperation({ summary: 'Get subjects for an exam track' })
  @ApiResponse({ status: 200 })
  async getSubjectsByExamType(
    @Param('examType') examType: string
  ): Promise<SubjectSummaryDto[]> {
    return this.curriculumService.getSubjectsByExamType(examType);
  }

  @Get('subjects/:subjectId/chapters')
  @ApiOperation({ summary: 'Get chapters for a subject' })
  @ApiResponse({ status: 200 })
  async getChaptersBySubject(
    @Param('subjectId') subjectId: string
  ): Promise<ChapterSummaryDto[]> {
    return this.curriculumService.getChaptersBySubject(subjectId);
  }

  @Get('chapters/:chapterId/topics')
  @ApiOperation({ summary: 'Get topics within a chapter' })
  @ApiResponse({ status: 200 })
  async getTopicsByChapter(
    @Param('chapterId') chapterId: string
  ): Promise<TopicSummaryDto[]> {
    return this.curriculumService.getTopicsByChapter(chapterId);
  }

  @Get('topics/:topicId')
  @ApiOperation({ summary: 'Get topic details with cheat sheet' })
  @ApiResponse({ status: 200 })
  async getTopicById(
    @Param('topicId') topicId: string
  ): Promise<TopicDetailDto> {
    return this.curriculumService.getTopicById(topicId);
  }

  @Get('topics/:topicId/flashcards')
  @ApiOperation({ summary: 'Get flashcards deck for active recall' })
  @ApiResponse({ status: 200 })
  async getTopicFlashcards(
    @Param('topicId') topicId: string
  ): Promise<FlashcardDto[]> {
    return this.curriculumService.getTopicFlashcards(topicId);
  }
}
