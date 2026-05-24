import React from 'react'
import { cn, getTechLogos } from "@/lib/utils";
import Image from "next/image";

// Affiche les icônes des technologies utilisées dans l'entretien
const DisplayTechIcons = async ({ techStack }: TechIconProps) => {

    // Récupère les logos correspondant aux technologies
    const techIcons = await getTechLogos(techStack)

    return (
        <div className="flex flex-row">

            {/* Affiche uniquement les 3 premières technologies */}
            {techIcons.slice(0, 3).map(({ tech, url }, index) => (

                <div
                    key={tech}
                    className={cn(
                        "relative group bg-dark-300 rounded-full p-2 flex-center",

                        // Décale légèrement les icônes pour les superposer
                        index >= 1 && '-ml-3'
                    )}
                >
                    {/* Tooltip affiché au survol */}
                    <span className="tech-tooltip">
                        {tech}
                    </span>

                    {/* Logo de la technologie */}
                    <Image
                        src={url}
                        alt={tech}
                        width={100}
                        height={100}
                        className="size-5"
                    />
                </div>
            ))}
        </div>
    )
}

export default DisplayTechIcons