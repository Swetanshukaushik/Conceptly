import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './modules/health/health.module';
import { configuration } from './config/configuration';
import { validateEnv } from './config/env.schema';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CurriculumModule } from './modules/curriculum/curriculum.module';
import { ReelsModule } from './modules/reels/reels.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { ProgressModule } from './modules/progress/progress.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { FeedModule } from './modules/feed/feed.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
      load: [
        () => {
          const env = validateEnv(process.env);
          return configuration(env);
        }
      ]
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CurriculumModule,
    ReelsModule,
    QuizzesModule,
    ProgressModule,
    BookmarksModule,
    FeedModule,
    AnalyticsModule
  ]
})
export class AppModule {}

