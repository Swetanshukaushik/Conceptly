import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma/prisma.service';
import { signJwt } from './jwt.util';
import {
  AuthResponseDto,
  GuestSessionRequestDto,
  LoginRequestDto,
  SignupRequestDto,
  UserProfileDto,
  ExamType,
} from '../../contracts';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private mapUserToDto(user: any): UserProfileDto {
    return {
      id: user.id,
      email: user.email ?? undefined,
      displayName: user.displayName,
      isGuest: user.isGuest,
      examType: user.examType as ExamType,
      classLevel: user.classLevel,
      language: (user.language as 'en' | 'hi') || 'en',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    };
  }

  async createGuestSession(dto: GuestSessionRequestDto): Promise<AuthResponseDto> {
    const examType: ExamType = dto.examType || 'TECH';
    const language = dto.language || 'en';

    const user = await this.prisma.user.create({
      data: {
        displayName: 'Guest Learner',
        isGuest: true,
        examType,
        language,
      },
    });

    const userDto = this.mapUserToDto(user);
    const accessToken = signJwt({
      sub: user.id,
      displayName: user.displayName,
      isGuest: true,
      examType: user.examType,
    });

    return {
      user: userDto,
      accessToken,
    };
  }

  async signup(dto: SignupRequestDto): Promise<AuthResponseDto> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordHash = dto.password ? hashPassword(dto.password) : undefined;
    const examType: ExamType = dto.examType || 'TECH';

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        displayName: dto.displayName || 'Conceptly Learner',
        passwordHash,
        isGuest: false,
        examType,
        classLevel: dto.classLevel,
        language: dto.language || 'en',
      },
    });

    const userDto = this.mapUserToDto(user);
    const accessToken = signJwt({
      sub: user.id,
      email: user.email,
      displayName: user.displayName,
      isGuest: false,
      examType: user.examType,
    });

    return {
      user: userDto,
      accessToken,
    };
  }

  async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (dto.password && user.passwordHash) {
      const hashed = hashPassword(dto.password);
      if (hashed !== user.passwordHash) {
        throw new UnauthorizedException('Invalid email or password');
      }
    }

    const userDto = this.mapUserToDto(user);
    const accessToken = signJwt({
      sub: user.id,
      email: user.email ?? undefined,
      displayName: user.displayName,
      isGuest: user.isGuest,
      examType: user.examType,
    });

    return {
      user: userDto,
      accessToken,
    };
  }
}
