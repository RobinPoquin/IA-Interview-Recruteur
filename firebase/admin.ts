import { cert, initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialise Firebase Admin côté serveur
const initFirebaseAdmin = () => {

    // Récupère les applications Firebase déjà lancées
    const apps = getApps();

    // Initialise Firebase uniquement si ce n'est pas déjà fait
    if (!apps.length) {

        initializeApp({
            credential: cert({

                // ID du projet Firebase
                projectId: process.env.FIREBASE_PROJECT_ID,

                // Email du compte de service Firebase
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,

                // Clé privée utilisée pour authentifier le serveur
                privateKey: process.env
                    .FIREBASE_PRIVATE_KEY
                    ?.replace(/\\n/g, "\n")
            })
        })
    }

    return {

        // Service Firebase Authentication
        auth: getAuth(),

        // Service Firestore Database
        db: getFirestore()
    }
}

// Exporte auth et db pour les utiliser partout dans le projet
export const { auth, db } = initFirebaseAdmin();