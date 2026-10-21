import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  UserProfileDto,
  UpdatePreferencesRequestDto,
  UserStatsDto,
} from '../../contracts';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile and target exam track' })
  @ApiResponse({ status: 200 })
  async getProfile(@CurrentUser() user: UserProfileDto): Promise<UserProfileDto> {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update user target track, class level, or language' })
  @ApiResponse({ status: 200 })
  async updatePreferences(
    @CurrentUser() user: UserProfileDto,
    @Body() dto: UpdatePreferencesRequestDto
  ): Promise<UserProfileDto> {
    return this.usersService.updatePreferences(user.id, dto);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Get aggregate study stats, streak, and quiz scores' })
  @ApiResponse({ status: 200 })
  async getUserStats(@CurrentUser() user: UserProfileDto): Promise<UserStatsDto> {
    return this.usersService.getUserStats(user.id);
  }
}
