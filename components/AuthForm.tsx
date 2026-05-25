"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import Image from "next/image";
import Link from "next/link";
import {toast} from "sonner";
import FormField from "@/components/FormField";
import {useRouter} from "next/navigation";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "@firebase/auth";
import {auth} from "@/firebase/client";
import {signIn, signUp} from "@/lib/actions/auth.action";

// crée un schéma de validation différent selon le type de formulaire
const authFormSchema = (type: FormType) => {

    return z.object({

        // le nom est obligatoire uniquement à l’inscription
        name: type === 'sign-up'
            ? z.string().min(3)
            : z.string().optional(),

        // vérifie que l’email est valide
        email: z.string().email(),

        // mot de passe avec minimum 3 caractères
        password: z.string().min(3),
    })
}

const AuthForm = ({type }: { type: FormType}) => {

    // permet de rediriger l’utilisateur vers une autre page
    const router = useRouter();

    // récupère le schéma selon le type de formulaire
    const formSchema = authFormSchema(type);

    // initialise le formulaire React Hook Form
    const form = useForm<z.infer<typeof formSchema>>({

        // connecte Zod au formulaire pour gérer la validation
        resolver: zodResolver(formSchema),

        // valeurs par défaut des champs
        defaultValues: {
            name: "",
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {

            // logique d’inscription
            if (type === "sign-up") {
                // récupère les valeurs du formulaire
                const { name, email, password } = values;

                // crée le compte utilisateur avec Firebase
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                // enregistre les infos utilisateur dans la base de données
                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password
                })

                // affiche une erreur si la création a échoué
                if (!result?.success) {
                    toast.error(result?.message)
                    return
                }

                // affiche un message de succès
                toast.success("Compte créer ! Veuillez vous connecter!")

                // redirige vers la page de connexion
                router.push("/sign-in")

            } else {
                // récupère les valeurs du formulaire
                const { email, password } = values;

                // connecte l'utilisateur avec Firebase
                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                // récupère le token de connexion Firebase
                const idToken =
                    await userCredential.user.getIdToken()

                // vérifie que le token existe bien
                if (!idToken) {
                    toast.error('Erreur lors de la connexion')
                    return
                }

                // crée la session côté serveur
                await signIn({
                    email,
                    idToken
                })

                // message de succès pour la connexion
                toast.success("Vous êtes connecté!")

                // redirige vers l’accueil
                router.push("/")
            }

        } catch (error) {

            console.log(error);

            // affiche un message d’erreur
            toast.error(`Il y a eu une erreur: ${error}`)
        }
    }

    // vérifie si le formulaire est celui de connexion
    const isSignIn = type === "sign-in";

    return (
        <div className="card-border lg:min-w-[566px]">

            <div className="flex flex-col gap-6 card py-14 px-10">

                {/* logo + nom du site */}
                <div className="flex flex-row gap-2 justify-center">

                    <Image
                        src="/logo.svg"
                        alt="logo"
                        height={32}
                        width={38}
                    />

                    <h2 className="text-primary-100">
                        PrepWise
                    </h2>
                </div>

                {/* titre principal */}
                <h3>Passez des entretiens test avec l'IA</h3>

                <Form {...form}>

                    {/* formulaire principal */}
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6 mt-4 form"
                    >

                        {/* champ nom affiché uniquement à l’inscription */}
                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Nom"
                                placeholder="Votre nom"
                            />
                        )}

                        {/* champ email */}
                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Votre adresse e-mail"
                            type="email"
                        />

                        {/* champ mot de passe */}
                        <FormField
                            control={form.control}
                            name="password"
                            label="Mot de passe"
                            placeholder="Votre mot de passe"
                            type="password"
                        />

                        {/* bouton d’envoi */}
                        <Button className="btn" type="submit">
                            {isSignIn ? 'Se connecter' : 'Créer un compte'}
                        </Button>
                    </form>
                </Form>

                {/* lien pour changer de page */}
                <p className="text-center">

                    {isSignIn
                        ? 'Pas encore de compte ?'
                        : 'Vous avez déjà un compte ?'
                    }

                    <Link
                        href={!isSignIn ? '/sign-in' : '/sign-up'}
                        className="font-bold text-user-primary ml-1"
                    >
                        {!isSignIn
                            ? "Se connecter"
                            : "Créer un compte"
                        }
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default AuthForm