import { extendType, nonNull, objectType, stringArg } from "nexus";   
import { NexusGenObjects } from "../../nexus-typegen"; 
export const Card = objectType({
    name: "Card",
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("question"); 
        t.nonNull.string("answer"); 
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
            
            resolve(parent, args, context) {    
                const newLink = context.prisma.card.create({   // 2
                    data: {
                        question: args.question,
                        answer: args.answer,
                    },
                });
                return newLink;
            },
        });
    },
});