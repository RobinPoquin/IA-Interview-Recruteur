import { ReactNode } from 'react'
import Link from "next/link";
import Image from "next/image";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

// Layout principal utilisé pour les pages protégées
const RootLayout = async ({
                              children
                          }: {
    children: ReactNode
}) => {

    // Vérifie si l'utilisateur est connecté
    const isUserAuthenticated = await isAuthenticated();

    // Redirige vers la connexion si l'utilisateur n'est pas authentifié
    if (!isUserAuthenticated) redirect('/sign-in')

    return (
        <div className="root-layout">

            {/* Barre de navigation du site */}
            <nav>

                {/* Logo + lien vers l'accueil */}
                <Link
                    href="/"
                    className="flex items-center gap-2"
                >
                    <Image
                        src="/logo.svg"
                        alt="Logo1"
                        width={38}
                        height={32}
                    />

                    <h2 className="text-primary-100">
                        PrepWise
                    </h2>
                </Link>
            </nav>

            {/* Affiche le contenu de la page actuelle */}
            {children}
        </div>
    )
}

export default RootLayout