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
            resolve(parent, args, context) {  
                return context.prisma.card.findMany();
            },
        });
    },
});
export const fetchOneCardQuery=extendType({
    type:"Query",
    definition(t){
        t.nonNull.field("fetchOneCard",{
            type:"Card",
            args:{
                id:nonNull(intArg())
            },
            //@ts-ignore
            async resolve(parent:any, args:any, context:any){
                const {id}=args

                if(!id){
                    throw new Error("Provide id of a card");
                }

                const findOneCard = await context.prisma.card.findUnique({
                    where:{
                        id:args.id
                    }
                })
               
                
                return findOneCard
            }
           

        })
    }
 })

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
        type:"String",
        args:{
            id: nonNull(intArg())
        },
        //@ts-ignore
        async resolve(parent, args,context) {
            const {id}=args
            if(!id )throw new Error("No Id provided")
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

},
})

export const updateCardMutation = extendType({
    type:"Mutation",

    definition(t){
        t.nonNull.field("updateCard",{
            type:"Card",
            args:{
                id:nonNull(intArg()),
                answer:nonNull(stringArg()),
                question:nonNull(stringArg())
            },
               //@ts-ignore
            async resolve(parent:any,args:any, context:any){
                const {id,answer,question}=args

                const { userId } = context;

                if (!userId) {  // 1
                    throw new Error("Cannot post without logging in.");
                }

            if(!id) throw new Error("please provide Id card");

            const cardToBeUpdated = await context.prisma.card.findUnique({
                where:{
                    id:args.id
                }
                
            })
            if(!cardToBeUpdated) throw new Error("No Card Found!!!");

        const updateCard=context.prisma.card.update(
            {
               where: {
                id:args.id
               },
               data:{
                question,
                answer
               }
            }
        )
        return updateCard
        }
        })
       
    }
})






 