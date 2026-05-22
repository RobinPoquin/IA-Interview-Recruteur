import React from 'react'
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    FormField as ShadcnFormField,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Control, FieldValues, Path } from "react-hook-form";

// Décrit les propriétés attendues par le composant
interface FormFieldProps<T extends FieldValues> {
    control: Control<T>; // objet react-hook-form pour gérer le champ
    name: Path<T> // nom du champ dans le formulaire
    label: string; // texte affiché au-dessus du champ
    placeholder?: string; // texte affiché quand le champ est vide
    type?: 'text' | 'password' | 'email' | 'file'; // type du champ input
}

// Composant générique réutilisable pour afficher un champ de formulaire
const FormField = <T extends FieldValues>({
                                              control,
                                              name,
                                              label,
                                              placeholder,
                                              type = "text"
                                          }: FormFieldProps<T>) => (
    <ShadcnFormField
        name={name} // indique quel champ est relié au formulaire
        control={control} // connecte le champ à react-hook-form
        render={({ field }) => ( // récupère les props du champ automatiquement
            <FormItem>
                <FormLabel className="label">
                    {label}
                </FormLabel>

                <FormControl>
                    <Input
                        className="input"
                        placeholder={placeholder} // texte affiché dans le champ vide
                        type={type} // définit le type de saisie
                        {...field} // connecte automatiquement value, onChange, etc.
                    />
                </FormControl>

                <FormMessage /> {/* affiche les erreurs de validation */}
            </FormItem>
        )}
    />
)

export default FormField