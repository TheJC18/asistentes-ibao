import { ReactNode } from 'react';
// Tipos para rutas protegidas
export interface ProtectedRouteProps {
	children: ReactNode;
}

export interface RoleProtectedRouteProps {
	children: ReactNode;
	allowedRoles?: string[];
}
// Tipo para países
export interface Country {
	code: string;
	name: string;
}
import { RoleType } from '@/core/helpers/roles';
import { GenderType } from '@/core/helpers';
import type { UserStatus } from '@/core/helpers/status';

export type ModalMode = 'view' | 'edit' | 'create';

// Tipo para opciones de género en i18n
export interface Gender {
	code: string;
	name: string;
}
// Resultado de autenticación
export interface SignInResult extends FirebaseResponse {
	uid?: string;
	email?: string;
	displayName?: string;
	photoURL?: string;
}
// Tipos para autenticación Firebase
export interface RegisterParams {
	email: string;
	password: string;
	displayName: string;
}

export interface LoginParams {
	email: string;
	password: string;
}

// Respuesta estándar para operaciones Firebase
export interface FirebaseResponse {
	ok: boolean;
	errorMessage?: string;
	errorCode?: string;
}
// Tipo utilitario para validaciones de formularios
export type FormValidationRules<T> = {
	[K in keyof T]?: [
		(value: T[K], formState?: T) => boolean,
		string
	];
};

export interface User {
	id: string;
	uid?: string;
	name: string;
	displayName?: string;
	email?: string;
	photoURL?: string;
	avatar?: string;
	role: RoleType;
	isMember?: boolean;
	gender?: GenderType;
	birthdate?: string | Date | null;
	nationality?: string;
	phone?: string;
	relation?: string;
	familyId?: string;
	createdBy?: string;
	hasWebAccess?: boolean;
	profileCompleted?: boolean;
	status?: UserStatus;
	createdAt?: string | Date;
	updatedAt?: string | Date;
	families?: string[];
	[key: string]: any;
}

// Tipos de respuesta estándar reutilizables
export interface StandardResponse {
	ok: boolean;
	errorMessage?: string;
}

export interface StandardMessageResponse extends StandardResponse {
	message?: string;
}

