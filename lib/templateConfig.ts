import dynamic from "next/dynamic";

export const templatesConfig : any= {
    NeoSpark : {
        navbar : dynamic(()=>import("@/components/NeoSpark/Navbar")),
        spotlight : true,
        sections:{
            hero : dynamic(()=>import("@/components/NeoSpark/Hero")),
            projects : dynamic(()=>import("@/components/NeoSpark/Projects")),
            experience : dynamic(()=>import("@/components/NeoSpark/ProfessionalJourney")),
            technologies : dynamic(()=>import("@/components/NeoSpark/Technologies")),
            contact : dynamic(()=>import("@/components/NeoSpark/Contact")),
        },
        hero : ["name","summary","titlePrefix","titleSuffixOptions","badge","actions"]
    },
    SimpleWhite:{
        sections:{
            hero : dynamic(()=>import("@/components/SimpleWhite/Hero")),
            projects : dynamic(()=>import("@/components/SimpleWhite/Projects")),
            skills : dynamic(()=>import("@/components/SimpleWhite/Skills")),
            experience : dynamic(()=>import("@/components/SimpleWhite/Experience")),
            technologies : dynamic(()=>import("@/components/SimpleWhite/Skills")),
            contact : dynamic(()=>import("@/components/SimpleWhite/Contact")),
        },
        hero : ["name","title","summary"]
    }
}