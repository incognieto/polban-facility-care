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
  console.log("🌱 Starting database seeding...");
  console.log("Database URL:", process.env.DATABASE_URL?.substring(0, 50) + "...");
  
  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    console.log(`Creating user: ${user.email}`);
    
    const result = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, passwordHash, role: user.role },
      create: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
      },
    });
    console.log(`✓ User created: ${result.email} (${result.role})`);
  }
  
  const totalUsers = await prisma.user.count();
  console.log(`✅ Seeding complete! Total users: ${totalUsers}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("❌ Seeding failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
