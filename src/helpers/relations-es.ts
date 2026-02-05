import { Relation } from '../types';

// Códigos de relaciones sin género (en inglés para consistencia en BD)
export const relationCodes = {
  PARENT: 'parent',
  CHILD: 'child', 
  SIBLING: 'sibling',
  SPOUSE: 'spouse',
  GRANDPARENT: 'grandparent',
  GRANDCHILD: 'grandchild'
};

// Lista de relaciones para el selector (con códigos en inglés y labels en español)
export const relationsES: Relation[] = [
  { code: relationCodes.PARENT, name: 'Padre/Madre', gender: 'neutral' },
  { code: relationCodes.CHILD, name: 'Hijo/Hija', gender: 'neutral' },
  { code: relationCodes.SIBLING, name: 'Hermano/Hermana', gender: 'neutral' },
  { code: relationCodes.SPOUSE, name: 'Esposo/Esposa', gender: 'neutral' },
  { code: relationCodes.GRANDPARENT, name: 'Abuelo/Abuela', gender: 'neutral' },
  { code: relationCodes.GRANDCHILD, name: 'Nieto/Nieta', gender: 'neutral' }
];

// Mapa de relaciones inversas según el género del familiar
export const inverseRelationsMap: Record<string, Record<string, string>> = {
  [relationCodes.PARENT]: {
    male: relationCodes.CHILD,
    female: relationCodes.CHILD,
    other: relationCodes.CHILD,
    neutral: relationCodes.CHILD
  },
  [relationCodes.CHILD]: {
    male: relationCodes.PARENT,
    female: relationCodes.PARENT,
    other: relationCodes.PARENT,
    neutral: relationCodes.PARENT
  },
  [relationCodes.SIBLING]: {
    male: relationCodes.SIBLING,
    female: relationCodes.SIBLING,
    other: relationCodes.SIBLING,
    neutral: relationCodes.SIBLING
  },
  [relationCodes.SPOUSE]: {
    male: relationCodes.SPOUSE,
    female: relationCodes.SPOUSE,
    other: relationCodes.SPOUSE,
    neutral: relationCodes.SPOUSE
  },
  [relationCodes.GRANDPARENT]: {
    male: relationCodes.GRANDCHILD,
    female: relationCodes.GRANDCHILD,
    other: relationCodes.GRANDCHILD,
    neutral: relationCodes.GRANDCHILD
  },
  [relationCodes.GRANDCHILD]: {
    male: relationCodes.GRANDPARENT,
    female: relationCodes.GRANDPARENT,
    other: relationCodes.GRANDPARENT,
    neutral: relationCodes.GRANDPARENT
  }
};

// Función para obtener la relación inversa
export const getInverseRelation = (relationCode: string, gender: string = 'neutral'): string => {
  const genderKey = gender.toLowerCase() as 'male' | 'female' | 'other' | 'neutral';
  return inverseRelationsMap[relationCode]?.[genderKey] || relationCode;
};

// Función para obtener el label de una relación según el género
export const getRelationLabel = (relationCode: string, gender: string = 'neutral'): string => {
  const labels: Record<string, Record<string, string>> = {
    [relationCodes.PARENT]: {
      male: 'Padre',
      female: 'Madre',
      other: 'Padre/Madre',
      neutral: 'Padre/Madre'
    },
    [relationCodes.CHILD]: {
      male: 'Hijo',
      female: 'Hija',
      other: 'Hijo/Hija',
      neutral: 'Hijo/Hija'
    },
    [relationCodes.SIBLING]: {
      male: 'Hermano',
      female: 'Hermana',
      other: 'Hermano/Hermana',
      neutral: 'Hermano/Hermana'
    },
    [relationCodes.SPOUSE]: {
      male: 'Esposo',
      female: 'Esposa',
      other: 'Esposo/Esposa',
      neutral: 'Esposo/Esposa'
    },
    [relationCodes.GRANDPARENT]: {
      male: 'Abuelo',
      female: 'Abuela',
      other: 'Abuelo/Abuela',
      neutral: 'Abuelo/Abuela'
    },
    [relationCodes.GRANDCHILD]: {
      male: 'Nieto',
      female: 'Nieta',
      other: 'Nieto/Nieta',
      neutral: 'Nieto/Nieta'
    }
  };

  const genderKey = gender.toLowerCase() as 'male' | 'female' | 'other' | 'neutral';
  return labels[relationCode]?.[genderKey] || relationCode;
};
