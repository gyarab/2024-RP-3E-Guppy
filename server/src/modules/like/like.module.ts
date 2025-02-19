import { Module } from '@nestjs/common';
import { LikeService } from './like.service';

@Module({
  imports: [],
  controllers: [],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
