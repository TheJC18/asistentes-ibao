/**
 * Retorna un array de relaciones [{ code, name }] según idioma
 */
export function getRelationsArray(lang: 'es' | 'en' = 'es') {
  const rels = getRelations(lang);
  return Object.keys(rels).map(code => ({
    code,
    name: rels[code].male + (rels[code].female ? '/' + rels[code].female : '')
  }));
}
// Helpers y constantes de relaciones centralizados
import { relationsES } from '@/i18n/relations/es';
import { relationsEN } from '@/i18n/relations/en';
import { relationCodes } from '@/core/constants/relations';

export const inverseRelationsMap: Record<string, Record<string, string>> = {
  [relationCodes.PARENT]: {
    male: relationCodes.CHILD,
    female: relationCodes.CHILD,
    other: relationCodes.CHILD,
    neutral: relationCodes.CHILD,
  },
  [relationCodes.CHILD]: {
    male: relationCodes.PARENT,
    female: relationCodes.PARENT,
    other: relationCodes.PARENT,
    neutral: relationCodes.PARENT,
  },
  [relationCodes.SIBLING]: {
    male: relationCodes.SIBLING,
    female: relationCodes.SIBLING,
    other: relationCodes.SIBLING,
    neutral: relationCodes.SIBLING,
  },
  [relationCodes.SPOUSE]: {
    male: relationCodes.SPOUSE,
    female: relationCodes.SPOUSE,
    other: relationCodes.SPOUSE,
    neutral: relationCodes.SPOUSE,
  },
  [relationCodes.GRANDPARENT]: {
    male: relationCodes.GRANDCHILD,
    female: relationCodes.GRANDCHILD,
    other: relationCodes.GRANDCHILD,
    neutral: relationCodes.GRANDCHILD,
  },
  [relationCodes.GRANDCHILD]: {
    male: relationCodes.GRANDPARENT,
    female: relationCodes.GRANDPARENT,
    other: relationCodes.GRANDPARENT,
    neutral: relationCodes.GRANDPARENT,
  },
};

export const getInverseRelation = (
  relationCode: string,
  gender: string = "neutral"
): string => {
  const genderKey = gender.toLowerCase() as
    | "male"
    | "female"
    | "neutral";
  return inverseRelationsMap[relationCode]?.[genderKey] || relationCode;
};

export const relationsByLocale = {
  es: relationsES,
  en: relationsEN,
} as const;

/**
 * Retorna el label de la relación según idioma y género usando los archivos de traducción
 */
export function getRelationLabelByLocale(
  language: 'es' | 'en',
  relationCode: string,
  gender: string = 'neutral'
): string {
  const labels = relationsByLocale[language];
  const genderKey = gender.toLowerCase() as 'male' | 'female';
  return labels[relationCode]?.[genderKey] || relationCode;
}

/**
 * Retorna el label de la relación según idioma y género
 */
export function getRelationLabel(
  relationCode: string,
  gender: string = 'neutral',
  lang: 'es' | 'en' = 'es'
): string {
  return getRelationLabelByLocale(lang, relationCode, gender);
}

/**
 * Retorna el listado de relaciones según idioma
 */
export function getRelations(lang: 'es' | 'en' = 'es') {
  return relationsByLocale[lang];
}