import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Fusionne proprement les classes Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// URL de base utilisée pour récupérer les logos des technologies
const techIconBaseURL =
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

// Nettoie le nom d'une technologie pour correspondre au nom du logo
const normalizeTechName = (tech: string) => {

  // Transforme le texte pour éviter les erreurs de correspondance
  const key = tech
      .toLowerCase()
      .replace(/\.js$/, "")
      .replace(/\s+/g, "");

  // Récupère le vrai nom utilisé dans les mappings
  return mappings[key as keyof typeof mappings];
};

// Vérifie si l'icône existe réellement à l'URL donnée
const checkIconExists = async (url: string) => {
  try {

    // Envoie une requête légère pour tester l'existence du fichier
    const response = await fetch(url, { method: "HEAD" });

    return response.ok; // retourne true si le fichier existe
  } catch {

    // retourne false en cas d'erreur réseau
    return false;
  }
};

// Génère les URLs des logos pour chaque technologie
export const getTechLogos = async (techArray: string[]) => {

  // Crée la liste des URLs possibles
  const logoURLs = techArray.map((tech) => {

    // Nettoie le nom de la technologie
    const normalized = normalizeTechName(tech);

    return {
      tech,

      // Construit l'URL du logo
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  // Vérifie si chaque logo existe
  const results = await Promise.all(
      logoURLs.map(async ({ tech, url }) => ({
        tech,

        // Utilise une image par défaut si le logo n'existe pas
        url: (await checkIconExists(url)) ? url : "/tech.svg",
      }))
  );

  return results;
};

// Retourne une image aléatoire pour illustrer un entretien
export const getRandomInterviewCover = () => {

  // Génère un index aléatoire dans la liste des images
  const randomIndex = Math.floor(
      Math.random() * interviewCovers.length
  );

  // Retourne le chemin complet de l'image choisie
  return `/covers${interviewCovers[randomIndex]}`;
};