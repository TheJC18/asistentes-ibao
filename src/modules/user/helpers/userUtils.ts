// Utilidades para validación de datos de usuario
import { countriesES, countriesEN } from "../../../helpers";
import { Country } from "../../../types";

export const USER_ROLES = {
  USER: 'user',
  MODERATOR: 'moderator', 
  ADMIN: 'admin'
} as const;

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

interface UserData {
  displayName?: string;
  email?: string;
  role?: string;
  status?: string;
  phone?: string;
  department?: string;
  location?: string;
  [key: string]: any;
}

interface ValidationErrors {
  [key: string]: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

// Validar estructura de datos de usuario
export const validateUserData = (userData: UserData): ValidationResult => {
  const errors: ValidationErrors = {};

  // Validar displayName
  if (!userData.displayName || userData.displayName.trim().length < 2) {
    errors.displayName = 'El nombre debe tener al menos 2 caracteres';
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!userData.email || !emailRegex.test(userData.email)) {
    errors.email = 'Email inválido';
  }

  // Validar rol
  if (userData.role && !Object.values(USER_ROLES).includes(userData.role as UserRole)) {
    errors.role = 'Rol inválido';
  }

  // Validar estado
  if (userData.status && !Object.values(USER_STATUS).includes(userData.status as UserStatus)) {
    errors.status = 'Estado inválido';
  }

  // Validar teléfono (opcional)
  if (userData.phone && userData.phone.trim().length > 0) {
    const phoneRegex = /^[\+]?[0-9\-\s\(\)]+$/;
    if (!phoneRegex.test(userData.phone)) {
      errors.phone = 'Formato de teléfono inválido';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Limpiar datos de usuario antes de guardar
export const sanitizeUserData = (userData: UserData): UserData => {
  const sanitized = { ...userData };

  // Limpiar strings
  if (sanitized.displayName) {
    sanitized.displayName = sanitized.displayName.trim();
  }
  
  if (sanitized.email) {
    sanitized.email = sanitized.email.trim().toLowerCase();
  }
  
  if (sanitized.phone) {
    sanitized.phone = sanitized.phone.trim();
  }
  
  if (sanitized.department) {
    sanitized.department = sanitized.department.trim();
  }
  
  if (sanitized.location) {
    sanitized.location = sanitized.location.trim();
  }

  // Asegurar valores por defecto
  if (!sanitized.role) {
    sanitized.role = USER_ROLES.USER;
  }
  
  if (!sanitized.status) {
    sanitized.status = USER_STATUS.ACTIVE;
  }

  // Remover campos vacíos opcionales
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === '' || sanitized[key] === null || sanitized[key] === undefined) {
      delete sanitized[key];
    }
  });

  return sanitized;
};

interface DisplayUser extends UserData {
  roleLabel: string;
  statusLabel: string;
  formattedCreatedAt: string;
  formattedUpdatedAt: string;
}

// Formatear usuario para mostrar en UI
export const formatUserForDisplay = (user: UserData | null): DisplayUser | null => {
  if (!user) return null;

  return {
    ...user,
    displayName: user.displayName || user.name || 'Sin nombre',
    roleLabel: getRoleLabel(user.role),
    statusLabel: getStatusLabel(user.status),
    formattedCreatedAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A',
    formattedUpdatedAt: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('es-ES') : 'N/A'
  };
};

// Obtener etiqueta legible del rol
export const getRoleLabel = (role?: string): string => {
  const roleLabels: Record<string, string> = {
    [USER_ROLES.USER]: 'Usuario',
    [USER_ROLES.MODERATOR]: 'Moderador', 
    [USER_ROLES.ADMIN]: 'Administrador'
  };
  
  return roleLabels[role || ''] || 'Desconocido';
};

// Obtener etiqueta legible del estado
export const getStatusLabel = (status?: string): string => {
  const statusLabels: Record<string, string> = {
    [USER_STATUS.ACTIVE]: 'Activo',
    [USER_STATUS.INACTIVE]: 'Inactivo',
    [USER_STATUS.SUSPENDED]: 'Suspendido'
  };
  
  return statusLabels[status || ''] || 'Desconocido';
};

// Obtener color del badge según el rol
export const getRoleColor = (role?: string): string => {
  const roleColors: Record<string, string> = {
    [USER_ROLES.USER]: 'success',
    [USER_ROLES.MODERATOR]: 'warning',
    [USER_ROLES.ADMIN]: 'primary'
  };
  
  return roleColors[role || ''] || 'secondary';
};

// Obtener color del badge según el estado
export const getStatusColor = (status?: string): string => {
  const statusColors: Record<string, string> = {
    [USER_STATUS.ACTIVE]: 'success',
    [USER_STATUS.INACTIVE]: 'secondary',
    [USER_STATUS.SUSPENDED]: 'error'
  };
  
  return statusColors[status || ''] || 'secondary';
};

// Obtener código del país por nombre
export const getCountryCodeByName = (countryName: string, language: 'es' | 'en' = 'es'): string | null => {
  if (!countryName) return null;
  
  const countries = language === 'es' ? countriesES : countriesEN;
  const country = countries.find(c => c.name === countryName);
  
  return country ? country.code : null;
};

// Obtener nombre del país por código
export const getCountryNameByCode = (countryCode: string, language: 'es' | 'en' = 'es'): string | null => {
  if (!countryCode) return null;
  
  const countries = language === 'es' ? countriesES : countriesEN;
  const country = countries.find(c => c.code === countryCode);
  
  return country ? country.name : null;
};

// Obtener objeto completo del país por nombre
export const getCountryByName = (countryName: string, language: 'es' | 'en' = 'es'): Country | null => {
  if (!countryName) return null;
  
  const countries = language === 'es' ? countriesES : countriesEN;
  return countries.find(c => c.name === countryName) || null;
};

// Obtener objeto completo del país por código
export const getCountryByCode = (countryCode: string, language: 'es' | 'en' = 'es'): Country | null => {
  if (!countryCode) return null;
  
  const countries = language === 'es' ? countriesES : countriesEN;
  return countries.find(c => c.code === countryCode) || null;
};

// Helpers para manejo de fechas de usuario

// Convierte fecha de usuario a Date para componentes
export const parseUserDate = (dateInput: string | Date | null): Date | null => {
  if (!dateInput) return null;
  if (dateInput instanceof Date) return dateInput;
  
  try {
    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
};

// Formatea fecha para mostrar en UI
export const formatUserDate = (dateInput: string | Date | null): string => {
  const date = parseUserDate(dateInput);
  return date ? date.toLocaleDateString('es-ES') : '';
};

// Convierte Date a string para almacenar
export const dateToUserString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
