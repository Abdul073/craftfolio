import dynamic from "next/dynamic";

export const templatesConfig = {
    NeoSpark : {
        navbar : dynamic(()=>import("@/components/NeoSpark/Navbar")),
        sections:{
            hero : dynamic(()=>import("@/components/NeoSpark/Hero")),
        projects : dynamic(()=>import("@/components/NeoSpark/Projects")),
        experience : dynamic(()=>import("@/components/NeoSpark/ProfessionalJourney")),
        technologies : dynamic(()=>import("@/components/NeoSpark/Technologies")),
        contact : dynamic(()=>import("@/components/NeoSpark/Contact")),
        }
    },
    SimpleWhite:{
        navbar : dynamic(()=>import("@/components/NeoSpark/Navbar")),
    }
}