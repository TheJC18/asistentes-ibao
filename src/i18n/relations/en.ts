import { relationCodes } from "@/core/constants/relations";

// Traducciones de relaciones por código y género
export const relationsEN: Record<string, Record<string, string>> = {
  [relationCodes.PARENT]: { male: 'Father', female: 'Mother' },
  [relationCodes.CHILD]: { male: 'Son', female: 'Daughter' },
  [relationCodes.SIBLING]: { male: 'Brother', female: 'Sister' },
  [relationCodes.SPOUSE]: { male: 'Husband', female: 'Wife' },
  [relationCodes.GRANDPARENT]: { male: 'Grandfather', female: 'Grandmother' },
  [relationCodes.GRANDCHILD]: { male: 'Grandson', female: 'Granddaughter' },
};