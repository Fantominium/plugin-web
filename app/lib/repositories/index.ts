import { prisma } from '@/app/lib/prisma';

export const repositories = {
  userAccount: prisma.userAccount,
  organizerProfile: prisma.organizerProfile,
};

export type Repositories = typeof repositories;
