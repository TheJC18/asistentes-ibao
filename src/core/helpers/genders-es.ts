import { getGenderNameByLocale, gendersES } from "@/i18n/genders";

export { gendersES };

export const getGenderName = (genderCode?: string): string => {
  return getGenderNameByLocale("es", genderCode);
};
