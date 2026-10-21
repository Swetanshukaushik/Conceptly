import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserProfileDto } from '../../contracts';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserProfileDto => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user) {
      return request.user;
    }

    // Fallback: check custom header or return default demo user
    const customUserId = request.headers['x-user-id'];
    return {
      id: typeof customUserId === 'string' ? customUserId : 'usr_demo_student',
      displayName: 'Conceptly Learner',
      isGuest: false,
      examType: 'TECH',
      classLevel: null,
      language: 'en',
      createdAt: new Date().toISOString(),
    };
  }
);
