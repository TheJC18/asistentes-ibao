import { Gender } from "@/types";

export const gendersEN: Gender[] = [
  { code: "male", name: "Male" },
  { code: "female", name: "Female" },
  { code: "other", name: "Other" },
];

export const getGenderNameEN = (genderCode?: string): string => {
  const gender = gendersEN.find((g) => g.code === genderCode?.toLowerCase());
  return gender ? gender.name : "Not specified";
};
