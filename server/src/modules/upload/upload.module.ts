import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { UploadService } from './upload.service';

@Module({
  imports: [TokenModule, UserModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
