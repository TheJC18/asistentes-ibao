// Lista de relaciones familiares en español
export const relationsES = [
  { code: "padre", name: "Padre", gender: "male" },
  { code: "madre", name: "Madre", gender: "female" },
  { code: "hijo", name: "Hijo", gender: "male" },
  { code: "hija", name: "Hija", gender: "female" },
  { code: "esposo", name: "Esposo", gender: "male" },
  { code: "esposa", name: "Esposa", gender: "female" },
  { code: "hermano", name: "Hermano", gender: "male" },
  { code: "hermana", name: "Hermana", gender: "female" },
  { code: "abuelo", name: "Abuelo", gender: "male" },
  { code: "abuela", name: "Abuela", gender: "female" },
  { code: "nieto", name: "Nieto", gender: "male" },
  { code: "nieta", name: "Nieta", gender: "female" },
  { code: "tio", name: "Tío", gender: "male" },
  { code: "tia", name: "Tía", gender: "female" },
  { code: "sobrino", name: "Sobrino", gender: "male" },
  { code: "sobrina", name: "Sobrina", gender: "female" },
  { code: "primo", name: "Primo", gender: "male" },
  { code: "prima", name: "Prima", gender: "female" },
  { code: "familiar", name: "Familiar", gender: "neutral" },
];

// Mapeo de relaciones inversas
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

// Función para obtener la relación inversa según el género del usuario
export const getInverseRelation = (relationCode, userGender) => {
  const baseInverseCode = inverseRelationsMap[relationCode?.toLowerCase()];
  
  if (!baseInverseCode) return "familiar";
  
  // Relaciones que varían según el género
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

// Función para obtener el nombre de la relación por código
export const getRelationName = (relationCode) => {
  const relation = relationsES.find(r => r.code === relationCode?.toLowerCase());
  return relation ? relation.name : relationCode;
};
