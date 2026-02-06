import { getGenderNameByLocale, gendersEN } from "@/i18n/genders";
import { relationCodes, inverseRelationsMap } from "@/i18n/relations";

export { gendersEN };

export const getGenderName = (genderCode?: string): string => {
  return getGenderNameByLocale("en", genderCode);
};

export { relationCodes, inverseRelationsMap };
