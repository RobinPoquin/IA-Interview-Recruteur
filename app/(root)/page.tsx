import React from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";

// Page principale affichée après connexion
const Page = () => {
    return (
        <>
            {/* Section de présentation avec bouton principal */}
            <section className="card-cta">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2>
                        Préparez vos entretien à l'avance grace à des entrainements et des feedbacks
                    </h2>

                    <p className="text-lg">
                        Entrainez vous avec des vraies question et des retours directs
                    </p>

                    {/* Bouton qui redirige vers la page d'entretien */}
                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/interview">
                            Démarrer l'interview maintenant
                        </Link>
                    </Button>
                </div>

                {/* Image affichée uniquement sur les écrans plus grands */}
                <Image
                    src="/robot.png"
                    alt="Robot"
                    width={400}
                    height={400}
                    className="max-sm:hidden"
                />
            </section>

            {/* Section qui affiche les anciens entretiens */}
            <section className="flex flex-col gap-6 mt-8">
                <h2>Vos entretiens</h2>

                <div className="interviews-section">
                    {/* Parcourt la liste des entretiens pour afficher une carte */}
                    {dummyInterviews.map((interview) => (
                        <InterviewCard
                            {...interview}
                            key={interview.id}
                        />
                    ))}

                    {/* Message possible si aucun entretien n'existe */}
                    {/* <p>Vous n'avez encore passé aucun entretien</p> */}
                </div>
            </section>

            {/* Section pour démarrer un nouvel entretien */}
            <section className="flex flex-col gap-6 mt-8">
                <h2>Faire un entretien</h2>

                <div className="interviews-section">
                    {/* Affiche les types d'entretiens disponibles */}
                    {dummyInterviews.map((interview) => (
                        <InterviewCard
                            {...interview}
                            key={interview.id}
                        />
                    ))}
                </div>
            </section>
        </>
    )
}

export default Page