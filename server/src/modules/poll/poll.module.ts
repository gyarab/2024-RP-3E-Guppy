import { Module } from '@nestjs/common';
import { PollService } from './poll.service';

@Module({
  imports: [],
  exports: [PollService],
  controllers: [],
  providers: [PollService],
})
export class PollModule {}
