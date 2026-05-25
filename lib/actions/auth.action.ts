'use server';

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

// Durée de validité du cookie : 1 semaine
const ONE_WEEK = 60 * 60 * 24 * 7;

// Fonction qui crée un nouvel utilisateur
export async function signUp(params: SignUpParams) {

    // Récupère les données envoyées depuis le formulaire
    const { uid, name, email } = params;

    try {

        // Vérifie si un utilisateur avec cet ID existe déjà
        const userRecord = await db
            .collection('users')
            .doc(uid)
            .get();

        // Empêche la création si le compte existe déjà
        if (userRecord.exists) {
            return {
                success: false,
                message: `Utilisateur existe déjà. Veuillez vous connecter`
            }
        }

        // Crée le document utilisateur dans Firestore
        await db
            .collection('users')
            .doc(uid)
            .set({
                name,
                email
            });

        return {
            success: true,
            message: "Compte créer !"
        }

    } catch (e: any) {

        // Affiche l'erreur dans la console serveur
        console.error(
            "Erreur lors de la création de l'utilisateur",
            e
        );

        // Cas spécifique : email déjà utilisé
        if (e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: "Cette adresse email est déjà utilisée"
            }
        }

        // Retourne une erreur générique
        return {
            success: false,
            message: "Echec lors de la création de l'utilisateur"
        }
    }
}

// Fonction de connexion utilisateur
export async function signIn(params: SignInParams) {

    // Récupère les infos envoyées
    const { email, idToken } = params;

    try {

        // Vérifie si l'utilisateur existe dans Firebase
        const userRecord = await auth.getUserByEmail(email);

        // Retourne une erreur si aucun utilisateur trouvé
        if (!userRecord) {
            return {
                success: false,
                message: "L'utilisateur n'existe pas. Créez un comtpe"
            }
        }

        // Crée le cookie de session
        await setSessionCookie(idToken)

    } catch (e: any) {

        // Affiche l'erreur côté serveur
        console.error(
            "Erreur lors de la création de l'utilisateur",
            e
        );

        return {
            success: false,
            message: "Echec lors de la connexion"
        }
    }
}

// Crée un cookie sécurisé pour garder la session active
export async function setSessionCookie(idToken: string) {

    // Récupère le gestionnaire de cookies Next.js
    const cookieStore = await cookies();

    // Génère un cookie Firebase à partir du token utilisateur
    const sessionCookie = await auth.createSessionCookie(
        idToken,
        {
            expiresIn: ONE_WEEK * 1000,
        }
    );

    // Sauvegarde le cookie dans le navigateur
    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true, // empêche l'accès via JavaScript
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    });
}

// Récupère les informations de l'utilisateur connecté
export async function getCurrentUser(): Promise<User | null> {

    // Récupère les cookies de la requête
    const cookieStore = await cookies();

    // Lit le cookie de session
    const sessionCookie = cookieStore
        .get('session')
        ?.value;

    // Retourne null si aucun cookie trouvé
    if (!sessionCookie) return null;

    try {

        // Vérifie que le cookie est valide
        const decodedClaims = await auth.verifySessionCookie(
            sessionCookie,
            true
        );

        // Récupère les données utilisateur dans Firestore
        const userRecord = await db
            .collection('users')
            .doc(decodedClaims.uid)
            .get()

        // Retourne null si aucun utilisateur trouvé
        if (!userRecord.exists) return null;

        // Retourne les données utilisateur
        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    } catch (e) {

        // Affiche l'erreur si le cookie est invalide
        console.log(e)

        return null;
    }
}

// Vérifie simplement si un utilisateur est connecté
export async function isAuthenticated() {

    // Tente de récupérer l'utilisateur connecté
    const user = await getCurrentUser();

    // Retourne true ou false
    return !!user;
}