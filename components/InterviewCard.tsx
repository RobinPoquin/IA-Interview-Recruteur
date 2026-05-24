import React from 'react'
import dayjs from "dayjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getRandomInterviewCover } from "@/lib/utils";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import 'dayjs/locale/fr'

// Carte qui affiche les informations d'un entretien
const InterviewCard = ({
                           interviewId,
                           userId,
                           role,
                           type,
                           techstack,
                           createdAt
                       }: InterviewCardProps) => {

    // Contiendra les retours de l'entretien une fois terminé
    const feedback = null as Feedback | null;

    // Remplace "mix" par un texte plus propre à afficher
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;

    // Formate la date pour un affichage lisible
    dayjs.locale('fr')
    const formatedDate = dayjs(
        feedback?.createdAt || createdAt || Date.now()
    ).format('DD MMMM YYYY');

    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-96">
            <div className="card-interview">

                <div>
                    {/* Badge affiché en haut à droite */}
                    <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
                        <p className="badge-text">
                            {normalizedType}
                        </p>
                    </div>

                    {/* Image aléatoire pour illustrer l'entretien */}
                    <Image
                        src={getRandomInterviewCover()}
                        alt="cover image"
                        width={90}
                        height={90}
                        className="rounded-full object-fit size-[90px]"
                    />

                    {/* Nom du poste concerné */}
                    <h3 className="mt-5 capitalize">
                        Entretien pour {role}
                    </h3>

                    {/* Bloc contenant la date et le score */}
                    <div className="flex flex-row gap-5 mt-3">

                        {/* Affichage de la date */}
                        <div className="flex flex-row gap-2">
                            <Image
                                src="/calendar.svg"
                                alt="Calendar"
                                width={22}
                                height={22}
                            />

                            <p>{formatedDate}</p>
                        </div>

                        {/* Affichage du score */}
                        <div className="flex flex-row gap-2 items-center">
                            <Image
                                src="star.svg"
                                alt="star"
                                width={22}
                                height={22}
                            />

                            <p>
                                {feedback?.totalScore || '---'}/100
                            </p>
                        </div>
                    </div>

                    {/* Message affiché selon si l'entretien est terminé ou non */}
                    <p className="line-clamp-2 mt-5">
                        {feedback?.finalAssessment ||
                            "Vous n'avez pas encore fait l'entretien. Passez le maintenant et améliorez vous !"}
                    </p>
                </div>

                {/* Partie basse avec les technologies et le bouton */}
                <div className="flex flex-row justify-between">

                    {/* Affiche les technologies liées à l'entretien */}
                    <DisplayTechIcons techStack={techstack} />

                    <Button className="btn-primary">
                        <Link
                            href={
                                feedback
                                    ? `/interview/${interviewId}/feedback`
                                    : `/interview/${interviewId}`
                            }
                        >
                            {feedback
                                ? 'Voir Retours'
                                : 'Voir Interview'}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default InterviewCard