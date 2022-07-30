import { extendType, intArg, nonNull, nullable, objectType, stringArg } from "nexus";   
import { NexusGenObjects } from "../../nexus-typegen"; 
export const Card = objectType({
    name: "Card",
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("question"); 
        t.nonNull.string("answer"); 
        t.field("postedBy", {   // 1
            type: "User",
            resolve(parent, args, context) {  // 2
                return context.prisma.card
                    .findUnique({ where: { id: parent.id } })
                    .postedBy();
            },
        });
    },
});


export const CardQuery = extendType({  
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {  
            type: "Card",
            resolve(parent, args, context, info) {  
                return context.prisma.card.findMany();
            },
        });
    },
});

export const CardMutation = extendType({  // 1
    type: "Mutation",    
    definition(t) {
        t.nonNull.field("post", {  // 2
            type: "Card",  
            args: {   // 3
                question: nonNull(stringArg()),
                answer: nonNull(stringArg()),
            },
            
           async resolve(parent, args, context) {    
                const { question, answer } = args;
                const { userId } = context;

                if (!userId) {  // 1
                    throw new Error("Cannot post without logging in.");
                }

                const newCard =await context.prisma.card.create({
                    data: {
                        question,
                        answer,
                        postedBy: { connect: { id: userId } },  // 2
                    },
                });

                return newCard;
            },
        });
    },
});
export const deleteCardMutation = extendType({
type:"Mutation",
definition(t) {
    t.nonNull.field("deleteCard",{
        type:"Card",
        args:{
            id: nonNull(intArg())
        },
        //@ts-ignore
        async resolve(parent, args,context, info) {
            const {id}=args
            if(!id )throw new Error("Axess Denied")
            const cardToBeDeleted = await context.prisma.card.findUnique({
                where:{
                    id:args.id,
                }
            })
            if(!cardToBeDeleted) throw new Error("Card not found");
            //if(cardToBeDeleted.postedById != id) throw new Error("You have no access to this card")
           const cardDeleted= await context.prisma.card.delete({
                where:{
                    id:args.id
                }
            })
            if(cardDeleted)
            return "Card have been deleted successfully!!!"       
        }
    }
    )
    t.field("updateCard",{
        type:"Card",
        args:{
            id: nonNull(intArg()),
            answer: nullable(stringArg()),
            question: nullable(stringArg())
        },
        //@ts-ignore
        // async resolve(parent, args, context){
        //     const {id}=args
        //     if(!id) throw new Error("Aceess Denied !!!")
        //     const cardTobeUpdated = await context.prisma.card.findUnique({
        //         where:{
        //             id:args.id
        //         }
        //     })
        //     if(!cardTobeUpdated) throw new Error("OOPs Card not found!!!");
        //     if(cardTobeUpdated.postedById!=id) throw new Error("you have no access to this card");
        //     const updatedCard = await context.prisma.card.update({
        //         where: {
        //           id: args.id,
        //         },
        //         data: {
        //           question: args.question,
        //           answer: args.answer
        //         }
        //       })
        //       return updatedCard

        // }
    })
},
})