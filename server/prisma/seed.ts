import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'test@mail.com',
      password: passwordHash,
      name: 'User One',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'test2@mail.com',
      password: passwordHash,
      name: 'User Two',
    },
  });

  const memberRole = await prisma.role.create({ data: { name: 'MEMBER' } });
  const ownerRole = await prisma.role.create({ data: { name: 'OWNER' } });

  const organizations = await Promise.all(
    [...Array(4)].map(async (_, i) => {
      return prisma.organization.create({
        data: {
          name: `Organization ${i + 1}`,
          description: `However, modern generators let you add personality to your placeholder text while maintaining the same benefits. From pirate speak to cupcake ingredients, these specialized generators help your mockups feel more aligned ${i + 1}`,
          joinCode: `JOINC${i + 1}`,
          users: {
            create: [
              {
                user: { connect: { id: user1.id } },
                role: { connect: { id: ownerRole.id } },
              },
              {
                user: { connect: { id: user2.id } },
                role: { connect: { id: memberRole.id } },
              },
            ],
          },
        },
      });
    }),
  );

  for (const orgPromise of organizations) {
    const org = await orgPromise;
    for (let i = 1; i <= 6; i++) {
      const post = await prisma.post.create({
        data: {
          title: `Post ${i} in ${org.name}`,
          content: `This is the content of post ${i}.`,
          authorId: user1.id,
          organizationId: org.id,
        },
      });

      const comments = await Promise.all(
        [...Array(Math.floor(Math.random() * 5) + 1)].map(async () => {
          return prisma.comment.create({
            data: {
              content: `Comment on post ${post.id}`,
              authorId: user2.id,
              postId: post.id,
            },
          });
        }),
      );

      await prisma.like.createMany({
        data: [...Array(Math.floor(Math.random() * 10) + 1)].map(() => ({
          userId: user2.id,
          postId: post.id,
        })),
      });

      for (const comment of comments) {
        await prisma.like.createMany({
          data: [...Array(Math.floor(Math.random() * 5) + 1)].map(() => ({
            userId: user1.id,
            commentId: comment.id,
          })),
        });
      }
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
