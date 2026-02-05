// List of family relations in English
export const relationsEN = [
  { code: "padre", name: "Father", gender: "male" },
  { code: "madre", name: "Mother", gender: "female" },
  { code: "hijo", name: "Son", gender: "male" },
  { code: "hija", name: "Daughter", gender: "female" },
  { code: "esposo", name: "Husband", gender: "male" },
  { code: "esposa", name: "Wife", gender: "female" },
  { code: "hermano", name: "Brother", gender: "male" },
  { code: "hermana", name: "Sister", gender: "female" },
  { code: "abuelo", name: "Grandfather", gender: "male" },
  { code: "abuela", name: "Grandmother", gender: "female" },
  { code: "nieto", name: "Grandson", gender: "male" },
  { code: "nieta", name: "Granddaughter", gender: "female" },
  { code: "tio", name: "Uncle", gender: "male" },
  { code: "tia", name: "Aunt", gender: "female" },
  { code: "sobrino", name: "Nephew", gender: "male" },
  { code: "sobrina", name: "Niece", gender: "female" },
  { code: "primo", name: "Cousin (male)", gender: "male" },
  { code: "prima", name: "Cousin (female)", gender: "female" },
  { code: "familiar", name: "Relative", gender: "neutral" },
];

// Inverse relations mapping (same as Spanish since codes are the same)
export const inverseRelationsMap = {
  padre: "hijo",
  madre: "hijo",
  hijo: "padre",
  hija: "padre",
  esposo: "esposa",
  esposa: "esposo",
  hermano: "hermano",
  hermana: "hermana",
  abuelo: "nieto",
  abuela: "nieto",
  nieto: "abuelo",
  nieta: "abuelo",
  tio: "sobrino",
  tia: "sobrino",
  sobrino: "tio",
  sobrina: "tio",
  primo: "primo",
  prima: "prima",
  familiar: "familiar",
};

// Function to get inverse relation based on user's gender
export const getInverseRelation = (relationCode, userGender) => {
  const baseInverseCode = inverseRelationsMap[relationCode?.toLowerCase()];
  
  if (!baseInverseCode) return "familiar";
  
  // Relations that vary by gender
  const genderVariableRelations = {
    hijo: userGender === "female" ? "hija" : "hijo",
    padre: userGender === "female" ? "madre" : "padre",
    nieto: userGender === "female" ? "nieta" : "nieto",
    abuelo: userGender === "female" ? "abuela" : "abuelo",
    sobrino: userGender === "female" ? "sobrina" : "sobrino",
    tio: userGender === "female" ? "tia" : "tio",
    hermano: userGender === "female" ? "hermana" : "hermano",
    primo: userGender === "female" ? "prima" : "primo",
  };
  
  return genderVariableRelations[baseInverseCode] || baseInverseCode;
};

// Function to get relation name by code
export const getRelationName = (relationCode) => {
  const relation = relationsEN.find(r => r.code === relationCode?.toLowerCase());
  return relation ? relation.name : relationCode;
};
