const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Testing Prisma connection...')
  // Try a simple query
  try {
    const result = await prisma.$queryRaw`SELECT 1+1 as result`
    console.log('Connection successful:', result)
  } catch (e) {
    console.error('Connection failed:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()