import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from './jwt.util';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyJwt(token);
      if (decoded) {
        const user = await this.prisma.user.findUnique({
          where: { id: decoded.sub },
        });

        if (user) {
          (req as any).user = {
            id: user.id,
            email: user.email ?? undefined,
            displayName: user.displayName,
            isGuest: user.isGuest,
            examType: user.examType,
            classLevel: user.classLevel,
            language: user.language as 'en' | 'hi',
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          };
        }
      }
    }
    next();
  }
}
