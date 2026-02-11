import { RoleType } from '@/core/constants/roles';

export type ModalMode = 'view' | 'edit' | 'create';

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
	role: RoleType | string;
	isMember?: boolean;
	gender?: 'male' | 'female' | 'other' | 'neutral' | string;
	birthdate?: string | Date | null;
	nationality?: string;
	phone?: string;
	relation?: string;
	familyId?: string;
	createdBy?: string;
	hasWebAccess?: boolean;
	profileCompleted?: boolean;
	status?: 'active' | 'inactive' | 'suspended' | string;
	createdAt?: string | Date;
	updatedAt?: string | Date;
	families?: string[];
	[key: string]: any;
}
// Tipos globales para la app

