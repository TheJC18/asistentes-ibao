import { gendersES, getGenderNameES } from "./es";
import { gendersEN, getGenderNameEN } from "./en";

export { gendersES, gendersEN };

export const gendersByLocale = {
  es: gendersES,
  en: gendersEN,
} as const;

export const getGenderNameByLocale = (
  language: "es" | "en",
  genderCode?: string
): string => {
  return language === "es"
    ? getGenderNameES(genderCode)
    : getGenderNameEN(genderCode);
};
