import {
  getInverseRelation,
  getRelationLabelByLocale,
  inverseRelationsMap,
  relationCodes,
  relationsES,
} from "@/i18n/relations";

export { relationCodes, inverseRelationsMap, relationsES, getInverseRelation };

export const getRelationLabel = (
  relationCode: string,
  gender: string = "neutral"
): string => {
  return getRelationLabelByLocale("es", relationCode, gender);
};
