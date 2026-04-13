import { Module } from '@nestjs/common';
import { ReelsController, ReelController } from './reels.controller';
import { ReelsService } from './reels.service';

@Module({
  controllers: [ReelsController, ReelController],
  providers: [ReelsService]
})
export class ReelsModule {}
