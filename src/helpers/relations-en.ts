import { relationCodes, inverseRelationsMap } from './relations-es';
import { Relation } from '../types';

// Lista de relaciones para el selector (con códigos en inglés y labels en inglés)
export const relationsEN: Relation[] = [
  { code: relationCodes.PARENT, name: 'Parent', gender: 'neutral' },
  { code: relationCodes.CHILD, name: 'Child', gender: 'neutral' },
  { code: relationCodes.SIBLING, name: 'Sibling', gender: 'neutral' },
  { code: relationCodes.SPOUSE, name: 'Spouse', gender: 'neutral' },
  { code: relationCodes.GRANDPARENT, name: 'Grandparent', gender: 'neutral' },
  { code: relationCodes.GRANDCHILD, name: 'Grandchild', gender: 'neutral' }
];

// Re-exportar funciones de relations-es para consistencia
export { getInverseRelation } from './relations-es';

// Función para obtener el label de una relación según el género (versión inglesa)
export const getRelationLabel = (relationCode: string, gender: string = 'neutral'): string => {
  const labels: Record<string, Record<string, string>> = {
    [relationCodes.PARENT]: {
      male: 'Father',
      female: 'Mother',
      other: 'Parent',
      neutral: 'Parent'
    },
    [relationCodes.CHILD]: {
      male: 'Son',
      female: 'Daughter',
      other: 'Child',
      neutral: 'Child'
    },
    [relationCodes.SIBLING]: {
      male: 'Brother',
      female: 'Sister',
      other: 'Sibling',
      neutral: 'Sibling'
    },
    [relationCodes.SPOUSE]: {
      male: 'Husband',
      female: 'Wife',
      other: 'Spouse',
      neutral: 'Spouse'
    },
    [relationCodes.GRANDPARENT]: {
      male: 'Grandfather',
      female: 'Grandmother',
      other: 'Grandparent',
      neutral: 'Grandparent'
    },
    [relationCodes.GRANDCHILD]: {
      male: 'Grandson',
      female: 'Granddaughter',
      other: 'Grandchild',
      neutral: 'Grandchild'
    }
  };

  const genderKey = gender.toLowerCase() as 'male' | 'female' | 'other' | 'neutral';
  return labels[relationCode]?.[genderKey] || relationCode;
};

// Re-exportar para compatibilidad
export { relationCodes, inverseRelationsMap };
