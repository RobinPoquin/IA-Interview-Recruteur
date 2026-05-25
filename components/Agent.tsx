import React from 'react'
import Image from "next/image";
import {cn} from "@/lib/utils";

// liste des différents états possibles de l’appel
enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const Agent = ({ userName }: AgentProps) => {

    // indique si l’IA est en train de parler
    const isSpeaking = true;

    // état actuel de l’appel
    const callStatus = CallStatus.FINISHED

    // liste des messages échangés pendant l’entretien
    const messages = [
        'Quel est votre nom ?',
        'Mon nom est Robin'
    ];

    // récupère le dernier message envoyé
    const lastMessage = messages[messages.length - 1];

    return (
        <>
            {/* zone principale de l’appel */}
            <div className={"call-view"}>

                {/* carte du recruteur IA */}
                <div className={"card-interviewer"}>

                    {/* avatar du recruteur */}
                    <div className={"avatar"}>
                        <Image
                            src={"/ai-avatar.png"}
                            alt={"vapi"}
                            width={65}
                            height={54}
                            className={"object-cover"}
                        />

                        {/* animation affichée quand l’IA parle */}
                        {isSpeaking && <span className={"animate-speak"}/>}
                    </div>

                    {/* nom affiché sous l’avatar */}
                    <h3>Recruteur IA</h3>
                </div>

                {/* carte de l’utilisateur */}
                <div className={"card-border"}>
                    <div className={"card-content"}>

                        {/* avatar utilisateur */}
                        <Image
                            src={"/user-avatar.png"}
                            alt="user avatar"
                            width={540}
                            height={540}
                            className={"rounded-full object-cover size-[120px]"}
                        />

                        {/* nom de l’utilisateur */}
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            {/* affiche la transcription seulement s’il y a des messages */}
            {messages.length > 0 && (
                <div className={"transcript-border"}>
                    <div className={"transcript"}>

                        {/* affiche le dernier message avec animation */}
                        <p
                            key={lastMessage}
                            className={cn(
                                'transition-opacity duration-500 opacity-0',
                                'animate-fadeIn opacity-100'
                            )}
                        >
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}

            {/* zone des boutons d’action */}
            <div className={"w-full flex justify-center"}>

                {/* affiche le bouton d’appel si la conversation n’est pas active */}
                {callStatus !== 'ACTIVE' ? (

                    <button className={"relative btn-call"}>

                        {/* animation de chargement pendant la connexion */}
                        <span
                            className={cn(
                                'absolute animate-ping rounded-full opacity-75',
                                callStatus !== 'CONNECTING' && 'hidden'
                            )}
                        />

                        {/* texte affiché dans le bouton */}
                        <span>
                            {callStatus === 'INACTIVE' || callStatus === 'FINISHED'
                                ? 'En Appel'
                                : '. . .'}
                        </span>
                    </button>

                ) : (

                    // bouton pour terminer l’appel
                    <button className={"btn-disconnect"}>
                        Fin
                    </button>
                )}
            </div>
        </>
    )
}

export default Agent