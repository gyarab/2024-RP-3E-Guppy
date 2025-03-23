import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PollService {
  constructor(private readonly prisma: PrismaService) {}

  async votePoll(userId: number, postId: number, optionId: number) {
    return this.prisma.$transaction(async (prisma) => {
      const poll = await prisma.poll.findUnique({
        where: { postId },
        include: { options: { include: { votes: true } } },
      });

      if (!poll) {
        throw new NotFoundException('Poll not found for this post.');
      }

      const existingVote = await prisma.pollVote.findUnique({
        where: { userId },
        include: { pollOption: true },
      });

      if (existingVote) {
        if (existingVote.pollOptionId === optionId) {
          throw new BadRequestException(
            'You have already voted for this option.',
          );
        }

        await prisma.pollVote.delete({ where: { id: existingVote.id } });

        await prisma.pollOption.update({
          where: { id: existingVote.pollOptionId },
          data: { votes: { deleteMany: { userId } } },
        });
      }

      return prisma.pollOption.update({
        where: { id: optionId },
        data: { votes: { create: { userId } } },
      });
    });
  }

  async removeVote(userId: number, postId: number) {
    return this.prisma.$transaction(async (prisma) => {
      const poll = await prisma.poll.findUnique({
        where: { postId },
        include: { options: { include: { votes: true } } },
      });

      if (!poll) {
        throw new NotFoundException('Poll not found for this post.');
      }

      const existingVote = await prisma.pollVote.findUnique({
        where: { userId },
      });

      if (!existingVote) {
        throw new BadRequestException('No vote to remove.');
      }

      await prisma.pollVote.delete({ where: { id: existingVote.id } });

      return prisma.pollOption.update({
        where: { id: existingVote.pollOptionId },
        data: { votes: { deleteMany: { userId } } },
      });
    });
  }
}
