import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { TokenModule } from './modules/token/token.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { UploadModule } from './modules/upload/upload.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    TokenModule,
    UserModule,
    AuthModule,
    PostModule,
    CommentModule,
    OrganizationModule,
    UploadModule,
  ],
})
export class AppModule {}
