import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { LikeModule } from '../like/like.module';

@Module({
  imports: [TokenModule, UserModule, LikeModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
