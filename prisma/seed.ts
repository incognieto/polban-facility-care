import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const users = [
  {
    name: "Zaenal",
    email: "zaenal@polban.ac.id",
    password: "Zaenal123!",
    role: Role.USER,
  },
  {
    name: "Farras",
    email: "farras@polban.ac.id",
    password: "Farras123!",
    role: Role.ADMIN,
  },
  {
    name: "Satria",
    email: "satria@polban.ac.id",
    password: "Satria123!",
    role: Role.TESTER,
  },
  {
    name: "Nieto",
    email: "nieto@polban.ac.id",
    password: "Nieto123!",
    role: Role.MANAGER,
  },
];

async function main() {
  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, passwordHash, role: user.role },
      create: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
