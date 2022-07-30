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
let Cards: NexusGenObjects["Card"][]= [   // 1
    {
        id: 1,
        question: "what is answer  30 + 60",
        answer: "now 90",
    },
    {
        id: 2,
        question: "give example of camera",
        answer: "cctv",
    },
];

export const CardQuery = extendType({  
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {  
            type: "Card",
            resolve(parent, args, context, info) {  
                return Cards;
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
                const { question, answer } = args;  // 4
                
                let idCount = Cards.length + 1;  // 5
                const Card = {
                    id: idCount,
                    question: question,
                    answer: answer,
                };
                Cards.push(Card);
                return Card;
            },
        });
    },
});