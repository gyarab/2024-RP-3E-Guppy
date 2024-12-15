import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TokenModule, UserModule],
  controllers: [UploadController],
})
export class UploadModule {}
