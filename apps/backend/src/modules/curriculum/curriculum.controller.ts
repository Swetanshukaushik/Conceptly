import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurriculumService } from './curriculum.service';
import { ClassLevelDto } from './dto/class-level.dto';
import { SubjectSummaryDto } from './dto/subject-summary.dto';
import { ChapterDto } from './dto/chapter.dto';
import { TopicDto } from './dto/topic.dto';
import { TopicDetailDto } from './dto/topic-detail.dto';

@ApiTags('curriculum')
@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get('exam-types')
  @ApiOkResponse({ type: Object, isArray: true })
  async getExamTypes() {
    return this.curriculumService.getExamTypes();
  }

  @Get('classes')
  @ApiOkResponse({ type: ClassLevelDto, isArray: true })
  async getClassLevels() {
    return this.curriculumService.getClassLevels();
  }

  @Get('classes/:classLevel/subjects')
  @ApiOkResponse({ type: SubjectSummaryDto, isArray: true })
  async getSubjectsByClassLevel(@Param('classLevel', ParseIntPipe) classLevel: number) {
    return this.curriculumService.getSubjectsByClassLevel(classLevel);
  }

  @Get('exam-types/:examType/subjects')
  @ApiOkResponse({ type: SubjectSummaryDto, isArray: true })
  async getSubjectsByExamType(@Param('examType') examType: string) {
    return this.curriculumService.getSubjectsByExamType(examType);
  }

  @Get('subjects/:subjectId/chapters')
  @ApiOkResponse({ type: ChapterDto, isArray: true })
  async getChaptersBySubject(@Param('subjectId') subjectId: string) {
    return this.curriculumService.getChaptersBySubject(subjectId);
  }

  @Get('chapters/:chapterId/topics')
  @ApiOkResponse({ type: TopicDto, isArray: true })
  async getTopicsByChapter(@Param('chapterId') chapterId: string) {
    return this.curriculumService.getTopicsByChapter(chapterId);
  }

  @Get('topics/:topicId')
  @ApiOkResponse({ type: TopicDetailDto })
  async getTopicById(@Param('topicId') topicId: string) {
    return this.curriculumService.getTopicById(topicId);
  }
}
