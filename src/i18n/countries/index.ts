import { countriesES } from "./es";
import { countriesEN } from "./en";

export { countriesES, countriesEN };

export const countriesByLocale = {
  es: countriesES,
  en: countriesEN,
} as const;
