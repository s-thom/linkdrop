import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const [foo, bar] = await Promise.all(
    ["foo", "bar"].map((name) =>
      prisma.tag.create({
        data: {
          name,
          userId: user.id,
        },
      })
    )
  );

  await Promise.all([
    prisma.link.create({
      data: {
        url: "https://example.com#foo",
        description: "Foo",
        tags: { connect: [{ id: foo.id }] },
        userId: user.id,
      },
    }),
    prisma.link.create({
      data: {
        url: "https://example.com#bar",
        description: "Bar",
        tags: { connect: [{ id: bar.id }] },
        userId: user.id,
      },
    }),
    prisma.link.create({
      data: {
        url: "https://example.com#foobar",
        description: "Foo and Bar",
        tags: { connect: [{ id: foo.id }, { id: bar.id }] },
        userId: user.id,
      },
    }),
  ]);

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
