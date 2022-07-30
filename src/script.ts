// 1
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main() {
    const AllCards = await prisma.card.findMany()
    console.log(AllCards);

    const newLink = await prisma.card.create({
        data: {
          question: 'Fullstack tutorial for GraphQL',
          answer: 'www.howtographql.com',
        },
      })
}


main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });