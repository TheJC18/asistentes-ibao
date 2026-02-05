import { Gender } from '../types';

export const gendersES: Gender[] = [
  { code: 'male', name: 'Masculino' },
  { code: 'female', name: 'Femenino' },
  { code: 'other', name: 'Otro' }
];

export const getGenderName = (genderCode?: string): string => {
  const gender = gendersES.find(g => g.code === genderCode?.toLowerCase());
  return gender ? gender.name : 'No especificado';
};
