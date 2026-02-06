import {
  getInverseRelation,
  getRelationLabelByLocale,
  inverseRelationsMap,
  relationCodes,
  relationsEN,
} from "@/i18n/relations";

export { relationCodes, inverseRelationsMap, relationsEN, getInverseRelation };

export const getRelationLabel = (
  relationCode: string,
  gender: string = "neutral"
): string => {
  return getRelationLabelByLocale("en", relationCode, gender);
};
