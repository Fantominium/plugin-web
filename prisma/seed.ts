import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@pluginbim.com';

  await prisma.userAccount.upsert({
    where: { email: adminEmail },
    update: { role: 'admin', isAllowlistedAdmin: true },
    create: {
      email: adminEmail,
      role: 'admin',
      isAllowlistedAdmin: true,
      organizerProfile: {
        create: {
          contactEmail: adminEmail,
          displayName: 'Designated Admin User (Test)',
        },
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
