// src/lib/db.ts
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  // Pass your database URL directly to the Prisma 7 driver adapter
  const adapter = new PrismaPg({ 
    connectionString: process.env.DATABASE_URL! 
  })
  
  // Pass the adapter into the client constructor
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma