import { relationsES, getRelationLabelES } from "./es";
import { relationsEN, getRelationLabelEN } from "./en";

export { relationCodes, inverseRelationsMap, getInverseRelation } from "./base";
export { relationsES, relationsEN };

export const relationsByLocale = {
  es: relationsES,
  en: relationsEN,
} as const;

export const getRelationLabelByLocale = (
  language: "es" | "en",
  relationCode: string,
  gender: string = "neutral"
): string => {
  return language === "es"
    ? getRelationLabelES(relationCode, gender)
    : getRelationLabelEN(relationCode, gender);
};
