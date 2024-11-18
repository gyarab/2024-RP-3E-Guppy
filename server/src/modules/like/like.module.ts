import { Module } from '@nestjs/common';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TokenModule, UserModule, PostModule, CommentModule],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [],
})
export class LikeModule {}
