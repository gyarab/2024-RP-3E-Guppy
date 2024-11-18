import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
