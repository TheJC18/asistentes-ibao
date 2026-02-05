// Lista de géneros en español
export const gendersES = [
  { code: "male", name: "Hombre" },
  { code: "female", name: "Mujer" },
];

// Función para obtener el nombre del género por código
export const getGenderName = (genderCode) => {
  const gender = gendersES.find(g => g.code === genderCode?.toLowerCase());
  return gender ? gender.name : genderCode;
};
