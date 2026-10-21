import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AuthResponseDto,
  GuestSessionRequestDto,
  SignupRequestDto,
  LoginRequestDto,
} from '../../contracts';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  @ApiOperation({ summary: 'Create anonymous guest session for seamless onboarding' })
  @ApiResponse({ status: 201 })
  async createGuestSession(@Body() dto: GuestSessionRequestDto): Promise<AuthResponseDto> {
    return this.authService.createGuestSession(dto);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new student account' })
  @ApiResponse({ status: 201 })
  async signup(@Body() dto: SignupRequestDto): Promise<AuthResponseDto> {
    return this.authService.signup(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in with existing credentials' })
  @ApiResponse({ status: 200 })
  async login(@Body() dto: LoginRequestDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }
}
