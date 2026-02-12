import { relationCodes } from "@/core/constants/relations";

// Traducciones de relaciones por código y género
export const relationsES: Record<string, Record<string, string>> = {
  [relationCodes.PARENT]: { male: 'Padre', female: 'Madre' },
  [relationCodes.CHILD]: { male: 'Hijo', female: 'Hija' },
  [relationCodes.SIBLING]: { male: 'Hermano', female: 'Hermana' },
  [relationCodes.SPOUSE]: { male: 'Esposo', female: 'Esposa' },
  [relationCodes.GRANDPARENT]: { male: 'Abuelo', female: 'Abuela' },
  [relationCodes.GRANDCHILD]: { male: 'Nieto', female: 'Nieta' },
};