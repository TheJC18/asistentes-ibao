import { Relation } from "@/types";
import { relationCodes } from "./base";

export const relationsES: Relation[] = [
  { code: relationCodes.PARENT, name: "Padre/Madre", gender: "neutral" },
  { code: relationCodes.CHILD, name: "Hijo/Hija", gender: "neutral" },
  { code: relationCodes.SIBLING, name: "Hermano/Hermana", gender: "neutral" },
  { code: relationCodes.SPOUSE, name: "Esposo/Esposa", gender: "neutral" },
  { code: relationCodes.GRANDPARENT, name: "Abuelo/Abuela", gender: "neutral" },
  { code: relationCodes.GRANDCHILD, name: "Nieto/Nieta", gender: "neutral" },
];

export const getRelationLabelES = (
  relationCode: string,
  gender: string = "neutral"
): string => {
  const labels: Record<string, Record<string, string>> = {
    [relationCodes.PARENT]: {
      male: "Padre",
      female: "Madre",
      other: "Padre/Madre",
      neutral: "Padre/Madre",
    },
    [relationCodes.CHILD]: {
      male: "Hijo",
      female: "Hija",
      other: "Hijo/Hija",
      neutral: "Hijo/Hija",
    },
    [relationCodes.SIBLING]: {
      male: "Hermano",
      female: "Hermana",
      other: "Hermano/Hermana",
      neutral: "Hermano/Hermana",
    },
    [relationCodes.SPOUSE]: {
      male: "Esposo",
      female: "Esposa",
      other: "Esposo/Esposa",
      neutral: "Esposo/Esposa",
    },
    [relationCodes.GRANDPARENT]: {
      male: "Abuelo",
      female: "Abuela",
      other: "Abuelo/Abuela",
      neutral: "Abuelo/Abuela",
    },
    [relationCodes.GRANDCHILD]: {
      male: "Nieto",
      female: "Nieta",
      other: "Nieto/Nieta",
      neutral: "Nieto/Nieta",
    },
  };

  const genderKey = gender.toLowerCase() as
    | "male"
    | "female"
    | "other"
    | "neutral";
  return labels[relationCode]?.[genderKey] || relationCode;
};
