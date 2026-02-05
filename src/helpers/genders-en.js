// List of genders in English
export const gendersEN = [
  { code: "male", name: "Male" },
  { code: "female", name: "Female" },
];

// Function to get gender name by code
export const getGenderName = (genderCode) => {
  const gender = gendersEN.find(g => g.code === genderCode?.toLowerCase());
  return gender ? gender.name : genderCode;
};
