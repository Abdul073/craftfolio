import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = ()=>{
  return new PrismaClient();
} 

declare const globalThis : {
  prismaGlobal : ReturnType<typeof prismaClientSingleton>
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma