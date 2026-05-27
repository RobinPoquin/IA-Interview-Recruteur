import {generateText} from "ai";
import {google} from "@ai-sdk/google";
import {getRandomInterviewCover} from "@/lib/utils";
import {db} from "@/firebase/admin";
import { groq } from "@ai-sdk/groq"

// route GET simple pour tester si l’API fonctionne
export async function GET() {

    // retourne une réponse JSON de succès
    return Response.json(
        { success: true, data: 'MERCI'},
        {status: 200}
    )
}

// route POST utilisée pour générer une interview
export async function POST(request: Request) {

    // récupère les données envoyées depuis le front
    const { type, role, level, techstack, amount, userid } = await request.json()

    try{

        // demande à l’IA de générer les questions
        const { text: questions } = await generateText({

            // modèle IA utilisé pour générer les questions
            //model: google('gemini-2.0-flash-001'),
            model: groq('llama-3.3-70b-versatile'),

            // prompt envoyé à l’IA
            prompt: `Prepare questions for a job interview.
                The job role is ${role}.
                The job experience level is ${level}.
                The tech stack used in the job is: ${techstack}.
                The focus between behavioural and technical questions should lean towards: ${type}.
                The amount of questions required is: ${amount}.
                Please return only the questions, without any additional text.
                The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
                Return the questions formatted like this:
                ["Question 1", "Question 2", "Question 3"]
                
                I want the questions to be in french
                Thank you! <3
            `,
        })

        // construit l’objet interview à enregistrer
        const interview = {

            // infos générales de l’entretien
            role, type, level,

            // transforme la liste des techs en tableau
            techstack: techstack.split(','),

            // convertit les questions générées en tableau JS
            questions: JSON.parse(questions),

            // ID de l’utilisateur lié à l’entretien
            userId: userid,

            // indique que l’entretien est prêt
            finalized: true,

            // ajoute une image aléatoire pour la carte
            coverImage: getRandomInterviewCover(),

            // date de création de l’entretien
            createdAt: new Date().toISOString(),
        }

        // enregistre l’entretien dans Firestore
        await db.collection("interview").add(interview)

        // retourne une réponse de succès
        return Response.json(
            { success: true},
            {status: 200}
        )

    } catch (e) {

        // affiche l’erreur dans la console serveur
        console.error(e)

        // retourne une erreur au front
        return Response.json(
            { success: false, error: e },
            { status: 500 }
        )
    }
}