import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { LikeModule } from '../like/like.module';

@Module({
  imports: [TokenModule, UserModule, LikeModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
