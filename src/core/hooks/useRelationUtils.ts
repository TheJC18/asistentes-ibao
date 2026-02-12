// Hook para exponer utilidades de relaciones conectadas al idioma actual.
// Devuelve relations, getRelationLabel, getInverseRelation listos para usar.
import { useLanguage } from '@/core/context/LanguageContext';
import { getRelationsArray, getRelationLabel, getInverseRelation } from '@/core/helpers/relations';

export function useRelationUtils() {
  const { language } = useLanguage();
  return {
    relations: getRelationsArray(language),
    getRelationLabel: (code: string) => getRelationLabel(code, language),
    getInverseRelation: (code: string) => getInverseRelation(code),
  };
}
