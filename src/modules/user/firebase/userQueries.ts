import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getCountFromServer,
  setDoc 
} from 'firebase/firestore';
import { FirebaseDB } from '@/firebase/config';
import { 
  createAuthUser, 
  updateUserPassword, 
  checkEmailExists, 
  linkEmailPassword 
} from '@/modules/auth/firebase/authQueries';
import { 
  convertDateFieldsToISO, 
  dateToISOString 
} from '@/core/helpers';
import { User, UserFilters } from '@/types';

// === INTERFACES ===

export interface GetUsersParams {
  searchTerm?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetUsersResult {
  ok: boolean;
  users?: User[];
  currentPage?: number;
  totalPages?: number;
  totalUsers?: number;
  limit?: number;
  errorMessage?: string;
}

export interface GetUserByIdResult {
  ok: boolean;
  user?: User;
  errorMessage?: string;
}

export interface CreateUserData {
  email?: string;
  password?: string;
  name?: string;
  displayName?: string;
  birthdate?: string | null;
  gender?: string;
  nationality?: string;
  isMember?: boolean;
  status?: string;
  role?: string;
  avatar?: string;
  photoURL?: string;
  hasWebAccess?: boolean;
  familyId?: string;
  relation?: string;
  createdBy?: string;
  [key: string]: any;
}

export interface CreateUserResult {
  ok: boolean;
  user?: User;
  message?: string;
  errorMessage?: string;
  email?: string;
  canCleanup?: boolean;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  name?: string;
  displayName?: string;
  birthdate?: string | null;
  gender?: string;
  nationality?: string;
  isMember?: boolean;
  status?: string;
  role?: string;
  avatar?: string;
  photoURL?: string;
  hasWebAccess?: boolean;
  [key: string]: any;
}

export interface UpdateUserResult {
  ok: boolean;
  user?: User;
  migrated?: boolean;
  oldId?: string;
  newId?: string;
  errorCode?: string;
  errorMessage?: string;
  requiresReauth?: boolean;
}

export interface DeleteUserResult {
  ok: boolean;
  warning?: string | null;
  familiesCleanedUp?: number;
  errorMessage?: string;
}

export interface FindUserByEmailResult {
  ok: boolean;
  user?: any;
  errorMessage?: string;
}

export interface GetUsersByRoleResult {
  ok: boolean;
  users?: User[];
  errorMessage?: string;
}

// === OBTENER LISTA DE USUARIOS ===
export const getUsersFromFirebase = async (params: GetUsersParams = {}): Promise<GetUsersResult> => {
    try {
        const {
            searchTerm = '',
            role = '',
            status = 'all',
            page = 1,
            limit: pageLimit = 10
        } = params;

        // Referencia a la colección de usuarios
        const usersRef = collection(FirebaseDB, 'users');
        
        // Query simple - obtenemos todos los usuarios
        const querySnapshot = await getDocs(usersRef);
        
        // Mapear documentos a objetos
        let users = querySnapshot.docs.map(doc => {
            const data = doc.data();
            
            const userData: User = {
                id: doc.id,
                // Convertir todos los campos de fecha a ISO strings para ser serializables en Redux
                createdAt: data.createdAt ? dateToISOString(data.createdAt) : '',
                updatedAt: data.updatedAt ? dateToISOString(data.updatedAt) : '',
                birthdate: data.birthdate ? dateToISOString(data.birthdate) : null,
                // Asegurar que todos los campos importantes estén incluidos
                profileCompleted: data.profileCompleted ?? false,
                role: data.role || 'user',
                name: data.name || data.displayName || '',
                displayName: data.displayName || data.name || '',
                email: data.email || '',
                nationality: data.nationality || '',
                phone: data.phone || '',
                isMember: data.isMember || false,
                avatar: data.avatar || data.photoURL || '/user_default.png',
                photoURL: data.photoURL || data.avatar || '/user_default.png',
                uid: data.uid || doc.id,
                gender: data.gender || '',
                status: data.status || 'active',
                hasWebAccess: data.hasWebAccess ?? true,
                families: data.families || []
            };
            
            return userData;
        });
        
        // Ordenar por fecha de creación en el cliente (más recientes primero)
        users.sort((userA, userB) => {
            if (!userA.createdAt) return 1;
            if (!userB.createdAt) return -1;
            return new Date(userB.createdAt).getTime() - new Date(userA.createdAt).getTime();
        });
        
        // Aplicar filtro de búsqueda en el lado del cliente
        // (En una implementación real, podrías usar Algolia o similar para búsqueda de texto completo)
        if (searchTerm) {
            users = users.filter(user => {
                const name = user.displayName || user.name || '';
                const email = user.email || '';
                return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       email.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }
        
        // Obtener conteo total (simplificado)
        const totalCountSnapshot = await getCountFromServer(collection(FirebaseDB, 'users'));
        const totalUsers = totalCountSnapshot.data().count;
        
        // Calcular paginación
        const totalPages = Math.ceil(totalUsers / pageLimit);
        
        return {
            ok: true,
            users,
            currentPage: page,
            totalPages,
            totalUsers,
            limit: pageLimit
        };
        
    } catch (error: any) {
        console.error('Error al obtener usuarios de Firebase:', error);
        return {
            ok: false,
            errorMessage: `Error al cargar usuarios: ${error.message}`
        };
    }
};

// === OBTENER USUARIO POR ID ===
export const getUserByIdFromFirebase = async (userId: string): Promise<GetUserByIdResult> => {
    try {
        const userDocRef = doc(FirebaseDB, 'users', userId);
        const userSnapshot = await getDoc(userDocRef);
        
        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const user: User = {
                id: userSnapshot.id,
                // Convertir todos los campos de fecha a ISO strings para ser serializables en Redux
                createdAt: userData.createdAt ? dateToISOString(userData.createdAt) : '',
                updatedAt: userData.updatedAt ? dateToISOString(userData.updatedAt) : '',
                birthdate: userData.birthdate ? dateToISOString(userData.birthdate) : null,
                uid: userData.uid || userSnapshot.id,
                name: userData.name || '',
                displayName: userData.displayName || '',
                email: userData.email || '',
                role: userData.role || 'user',
                status: userData.status || 'active',
                profileCompleted: userData.profileCompleted ?? false,
                nationality: userData.nationality || '',
                gender: userData.gender || '',
                isMember: userData.isMember || false,
                avatar: userData.avatar || '/user_default.png',
                photoURL: userData.photoURL || '/user_default.png',
                hasWebAccess: userData.hasWebAccess ?? true,
                families: userData.families || []
            };
            
            return {
                ok: true,
                user
            };
        } else {
            return {
                ok: false,
                errorMessage: 'Usuario no encontrado'
            };
        }
        
    } catch (error: any) {
        console.error('Error al obtener usuario por ID:', error);
        return {
            ok: false,
            errorMessage: `Error al cargar usuario: ${error.message}`
        };
    }
};

// === CREAR USUARIO ===
export const createUserInFirebase = async (userData: CreateUserData): Promise<CreateUserResult> => {
    try {
        const hasWebAccess = userData.hasWebAccess === true; // Por defecto false
        
        // Si tiene acceso web, necesita email y contraseña
        if (hasWebAccess) {
            if (!userData.email || !userData.password) {
                return {
                    ok: false,
                    errorMessage: 'Email y contraseña son obligatorios para crear un usuario con acceso web'
                };
            }

            // ✅ VERIFICAR SI EL EMAIL YA EXISTE EN AUTHENTICATION
            const emailExists = await checkEmailExists(userData.email);
            if (emailExists) {
                return {
                    ok: false,
                    errorMessage: `El email ${userData.email} ya está registrado en el sistema. Si deseas reutilizarlo, primero elimina el usuario existente desde Firebase Console > Authentication.`,
                    email: userData.email
                };
            }

            // 1. Crear usuario en Authentication (authQueries)
            const authResult = await createAuthUser(userData.email, userData.password);
            
            if (!authResult.ok) {
                return authResult; // Retornar error con canCleanup si aplica
            }
            
            const { uid } = authResult;

            // 2. Preparar datos para Firestore (sin contraseña)
            const { password, familyId, relation, createdBy, ...userDataWithoutPassword } = userData;
            
            // Determinar si el perfil está completo (creado como familiar con todos los datos)
            const isProfileComplete = !!familyId && !!userData.name && !!userData.birthdate && !!userData.gender;
            
            const newUserData = {
                ...userDataWithoutPassword,
                uid,
                name: userData.name || userData.displayName || '',
                displayName: userData.displayName || userData.name || '',
                email: userData.email,
                birthdate: userData.birthdate || null,
                gender: userData.gender || '',
                nationality: userData.nationality || '',
                isMember: userData.isMember ?? false,
                createdAt: new Date(),
                updatedAt: new Date(),
                profileCompleted: isProfileComplete,
                status: userData.status || 'active',
                role: userData.role || 'user',
                avatar: userData.avatar || userData.photoURL || '/user_default.png',
                photoURL: userData.photoURL || userData.avatar || '/user_default.png',
                hasWebAccess: true, // Tiene acceso web
                families: [], // Array de IDs de familias a las que pertenece
            };
            
            // 3. Crear documento en Firestore
            const userDocRef = doc(FirebaseDB, 'users', uid!);
            await setDoc(userDocRef, newUserData);
            
            // 4. Si se proporcionó familyId, agregar a esa familia (usuario creado como familiar)
            if (familyId && relation) {

                const { addUserToFamily } = await import('@/modules/family/firebase/familyQueries');
                
                const currentUserId = userData.createdBy || uid!;
                
                await addUserToFamily(familyId, uid!, {
                    relation,
                    role: 'member',
                    addedBy: currentUserId
                });
            }
            
            // 5. Retornar usuario creado
            const createdUser: User = {
                id: uid!,
                ...convertDateFieldsToISO(newUserData, ['createdAt', 'updatedAt', 'birthdate']) as any,
                uid: uid!,
                email: userData.email,
                name: userData.name || '',
                displayName: userData.displayName || '',
                role: userData.role || 'user',
                status: userData.status || 'active',
                profileCompleted: isProfileComplete,
                nationality: userData.nationality || '',
                gender: userData.gender || '',
                isMember: userData.isMember ?? false,
                avatar: userData.avatar || '/user_default.png',
                photoURL: userData.photoURL || '/user_default.png',
                hasWebAccess: true,
                families: [],
                birthdate: userData.birthdate || null,
            };
            
            return {
                ok: true,
                user: createdUser,
                message: 'Usuario creado correctamente. Ahora puede iniciar sesión.'
            };
        } 
        
        // Sin acceso web - solo guardar en Firestore (familiar sin login)
        else {
            const { password, familyId, relation, createdBy, ...userDataWithoutPassword } = userData;
            
            // Generar ID único para el documento
            const userDocRef = doc(collection(FirebaseDB, 'users'));
            const uid = userDocRef.id;
            
            // Los usuarios sin acceso web siempre tienen perfil completo (no pueden completarlo ellos)
            const newUserData = {
                ...userDataWithoutPassword,
                uid,
                name: userData.name || userData.displayName || '',
                displayName: userData.displayName || userData.name || '',
                email: userData.email || '',
                birthdate: userData.birthdate || null,
                gender: userData.gender || '',
                nationality: userData.nationality || '',
                isMember: userData.isMember ?? false,
                createdAt: new Date(),
                updatedAt: new Date(),
                profileCompleted: true, // Perfil completo porque fue creado con todos los datos
                status: userData.status || 'active',
                role: userData.role || 'user',
                avatar: userData.avatar || userData.photoURL || '/user_default.png',
                photoURL: userData.photoURL || userData.avatar || '/user_default.png',
                hasWebAccess: false, // NO tiene acceso web
                families: [], // Array de IDs de familias a las que pertenece
            };
            
            // Crear documento en Firestore
            await setDoc(userDocRef, newUserData);
            
            // Los usuarios sin acceso web son siempre familiares, solo agregar a familia existente
            if (familyId && relation) {
                // Importar funciones de familia
                const { addUserToFamily } = await import('@/modules/family/firebase/familyQueries');
                
                const currentUserId = userData.createdBy || uid;
                
                // Solo agregar el nuevo usuario a la familia del creador
                await addUserToFamily(familyId, uid, {
                    relation,
                    role: 'member',
                    addedBy: currentUserId
                });
            }
            
            // Retornar usuario creado
            const createdUser: User = {
                id: uid,
                ...convertDateFieldsToISO(newUserData, ['createdAt', 'updatedAt', 'birthdate']) as any,
                uid,
                email: userData.email || '',
                name: userData.name || '',
                displayName: userData.displayName || '',
                role: userData.role || 'user',
                status: userData.status || 'active',
                profileCompleted: true,
                nationality: userData.nationality || '',
                gender: userData.gender || '',
                isMember: userData.isMember ?? false,
                avatar: userData.avatar || '/user_default.png',
                photoURL: userData.photoURL || '/user_default.png',
                hasWebAccess: false,
                families: [],
                birthdate: userData.birthdate || null,
            };
            
            return {
                ok: true,
                user: createdUser,
                message: 'Familiar agregado correctamente.'
            };
        }
        
    } catch (error: any) {
        console.error('Error al crear usuario:', error);
        return {
            ok: false,
            errorMessage: error.message || 'Error al crear usuario'
        };
    }
};

// === ACTUALIZAR USUARIO ===
export const updateUserInFirebase = async (userId: string, userData: UpdateUserData): Promise<UpdateUserResult> => {
    try {
        // Obtener datos actuales del usuario
        const userDocRef = doc(FirebaseDB, 'users', userId);
        const userSnapshot = await getDoc(userDocRef);
        
        if (!userSnapshot.exists()) {
            return {
                ok: false,
                errorMessage: 'Usuario no encontrado'
            };
        }
        
        const currentUserData = userSnapshot.data();
        const wasWebAccessEnabled = currentUserData.hasWebAccess || false;
        const isWebAccessNowEnabled = userData.hasWebAccess === true;
        
        // Separar contraseña y email de los otros datos
        const { password, email, ...dataWithoutPassword } = userData;
        
        // CASO 1: Usuario NO tenía acceso web y ahora SÍ (necesita crear en Authentication)
        if (!wasWebAccessEnabled && isWebAccessNowEnabled && email && password) {
            // Verificar si el email ya existe
            const emailExists = await checkEmailExists(email);
            if (emailExists) {
                return {
                    ok: false,
                    errorMessage: `El email ${email} ya está registrado en Authentication.`,
                };
            }
            
            // Crear usuario en Authentication
            const authResult = await createAuthUser(email, password);
            
            if (!authResult.ok) {
                return authResult;
            }
            
            const newAuthUid = authResult.uid!;
            
            // IMPORTANTE: El usuario tiene un UID de Firestore diferente al de Authentication
            // Necesitamos migrar los datos al nuevo UID
            
            // 1. Copiar todos los datos del usuario actual al nuevo UID
            const newUserDocRef = doc(FirebaseDB, 'users', newAuthUid);
            const migratedData = {
                ...currentUserData,
                ...dataWithoutPassword,
                uid: newAuthUid, // Nuevo UID de Authentication
                email: email,
                hasWebAccess: true,
                updatedAt: new Date(),
            };
            
            await setDoc(newUserDocRef, migratedData);
            
            // 2. Actualizar las referencias en las familias
            if (currentUserData.families && currentUserData.families.length > 0) {
                const { updateUserIdInFamilies } = await import('@/modules/family/firebase/familyQueries');
                await updateUserIdInFamilies(userId, newAuthUid, currentUserData.families);
            }
            
            // 3. Eliminar el documento viejo
            await deleteDoc(userDocRef);
            
            // 4. Obtener el usuario migrado
            const migratedSnapshot = await getDoc(newUserDocRef);
            const migratedUserData = migratedSnapshot.data();
            const migratedUser: User = {
                id: migratedSnapshot.id,
                ...convertDateFieldsToISO(migratedUserData, ['createdAt', 'updatedAt', 'birthdate']) as any,
                uid: migratedSnapshot.id,
                email: migratedUserData?.email || '',
                name: migratedUserData?.name || '',
                displayName: migratedUserData?.displayName || '',
                role: migratedUserData?.role || 'user',
                status: migratedUserData?.status || 'active',
                profileCompleted: migratedUserData?.profileCompleted ?? false,
                nationality: migratedUserData?.nationality || '',
                gender: migratedUserData?.gender || '',
                isMember: migratedUserData?.isMember || false,
                avatar: migratedUserData?.avatar || '/user_default.png',
                photoURL: migratedUserData?.photoURL || '/user_default.png',
                hasWebAccess: migratedUserData?.hasWebAccess ?? true,
                families: migratedUserData?.families || [],
                birthdate: migratedUserData?.birthdate || null,
            };
            
            return {
                ok: true,
                user: migratedUser,
                migrated: true, // Indicador de que se migró
                oldId: userId,
                newId: newAuthUid
            };
        }
        // CASO 2: Usuario YA tenía acceso web y quiere cambiar/agregar contraseña
        else if (wasWebAccessEnabled && password && password.trim() !== '') {
            // Verificar si el usuario actual tiene el proveedor de contraseña
            const { FirebaseAuth } = await import('@/firebase/config');
            const currentUser = FirebaseAuth.currentUser;
            
            if (!currentUser) {
                return {
                    ok: false,
                    errorCode: 'no-user',
                    errorMessage: 'No hay usuario autenticado'
                };
            }
            
            const hasPasswordProvider = currentUser.providerData.some(
                provider => provider.providerId === 'password'
            );
            
            if (hasPasswordProvider) {
                // Ya tiene contraseña, solo actualizarla
                const passwordResult = await updateUserPassword(password);
                
                if (!passwordResult.ok) {
                    // Propagar el error con todos sus detalles
                    return {
                        ok: false,
                        errorCode: passwordResult.errorCode,
                        errorMessage: passwordResult.errorMessage,
                        requiresReauth: passwordResult.requiresReauth
                    };
                }
            } else {
                // No tiene contraseña, vincular credenciales (usuario de Google que quiere agregar contraseña)
                const linkResult = await linkEmailPassword(email || currentUserData.email, password);
                
                if (!linkResult.ok) {
                    return linkResult;
                }
            }
        }
        
        // Preparar datos para Firestore (sin contraseña)
        const updateData: any = {
            ...dataWithoutPassword,
            name: dataWithoutPassword.name || dataWithoutPassword.displayName || '',
            displayName: dataWithoutPassword.displayName || dataWithoutPassword.name || '',
            avatar: dataWithoutPassword.avatar || dataWithoutPassword.photoURL || '/user_default.png',
            photoURL: dataWithoutPassword.photoURL || dataWithoutPassword.avatar || '/user_default.png',
            profileCompleted: true,
            updatedAt: new Date(),
            // Actualizar hasWebAccess si viene en los datos
            ...(userData.hasWebAccess !== undefined && { hasWebAccess: userData.hasWebAccess })
        };
        
        // Actualizar en Firestore
        await updateDoc(userDocRef, updateData);
        
        // Obtener documento actualizado
        const updatedSnapshot = await getDoc(userDocRef);
        
        if (updatedSnapshot.exists()) {
            const updatedUserData = updatedSnapshot.data();
            const updatedUser: User = {
                id: updatedSnapshot.id,
                ...convertDateFieldsToISO(updatedUserData, ['createdAt', 'updatedAt', 'birthdate']) as any,
                uid: updatedUserData.uid || updatedSnapshot.id,
                email: updatedUserData.email || '',
                name: updatedUserData.name || '',
                displayName: updatedUserData.displayName || '',
                role: updatedUserData.role || 'user',
                status: updatedUserData.status || 'active',
                profileCompleted: updatedUserData.profileCompleted ?? false,
                nationality: updatedUserData.nationality || '',
                gender: updatedUserData.gender || '',
                isMember: updatedUserData.isMember || false,
                avatar: updatedUserData.avatar || '/user_default.png',
                photoURL: updatedUserData.photoURL || '/user_default.png',
                hasWebAccess: updatedUserData.hasWebAccess ?? true,
                families: updatedUserData.families || [],
                birthdate: updatedUserData.birthdate || null,
            };
            
            return {
                ok: true,
                user: updatedUser
            };
        } else {
            return {
                ok: false,
                errorMessage: 'Usuario no encontrado después de la actualización'
            };
        }
        
    } catch (error: any) {
        console.error('Error al actualizar usuario en Firebase:', error);
        
        // Si el error ya tiene estructura de respuesta (viene de una función auxiliar), retornarlo tal cual
        if (error.ok === false) {
            return error;
        }
        
        return {
            ok: false,
            errorCode: error.code || 'unknown',
            errorMessage: `Error al actualizar usuario: ${error.message}`
        };
    }
};

// === ELIMINAR USUARIO ===
// Solo elimina de Firestore. Authentication debe eliminarse manualmente o con Cloud Functions
export const deleteUserFromFirebase = async (userId: string): Promise<DeleteUserResult> => {
    try {
        const userDocRef = doc(FirebaseDB, 'users', userId);
        const userSnapshot = await getDoc(userDocRef);
        
        if (!userSnapshot.exists()) {
            return {
                ok: false,
                errorMessage: 'Usuario no encontrado'
            };
        }

        const userData = userSnapshot.data();
        const userFamilies = userData.families || [];
        
        // 1. Eliminar usuario de todas sus familias
        if (userFamilies.length > 0) {
            const { removeUserFromFamily } = await import('@/modules/family/firebase/familyQueries');
            
            const deletePromises = userFamilies.map(async (familyId: string) => {
                try {
                    await removeUserFromFamily(familyId, userId);
                } catch (error) {
                    console.error(`Error al eliminar usuario de familia ${familyId}:`, error);
                }
            });
            
            await Promise.all(deletePromises);
        }
        
        // 2. Advertencia: Authentication debe eliminarse por separado
        if (userData.email) {
            console.warn(`⚠️ El usuario ${userData.email} debe ser eliminado de Firebase Authentication manualmente`);
        }
        
        // 3. Eliminar documento del usuario de Firestore
        await deleteDoc(userDocRef);
        
        return {
            ok: true,
            warning: userData.email ? 'Usuario eliminado de Firestore. Authentication debe eliminarse manualmente.' : null,
            familiesCleanedUp: userFamilies.length
        };
        
    } catch (error: any) {
        console.error('Error al eliminar usuario de Firebase:', error);
        return {
            ok: false,
            errorMessage: `Error al eliminar usuario: ${error.message}`
        };
    }
};

// === FUNCIONES AUXILIARES ===

// Buscar usuarios por email (útil para validaciones)
export const findUserByEmail = async (email: string): Promise<FindUserByEmailResult> => {
    try {
        const usersRef = collection(FirebaseDB, 'users');
        const q = query(usersRef, where('email', '==', email.toLowerCase()));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return {
                ok: true,
                user: {
                    id: userDoc.id,
                    ...userDoc.data()
                }
            };
        } else {
            return {
                ok: false,
                errorMessage: 'Usuario no encontrado'
            };
        }
        
    } catch (error: any) {
        console.error('Error al buscar usuario por email:', error);
        return {
            ok: false,
            errorMessage: `Error en la búsqueda: ${error.message}`
        };
    }
};

// Obtener usuarios por rol
export const getUsersByRole = async (role: string): Promise<GetUsersByRoleResult> => {
    try {
        const usersRef = collection(FirebaseDB, 'users');
        const q = query(usersRef, where('role', '==', role), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const users: User[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...convertDateFieldsToISO(data, ['createdAt', 'updatedAt', 'birthdate']) as any,
                uid: data.uid || doc.id,
                email: data.email || '',
                name: data.name || '',
                displayName: data.displayName || '',
                role: data.role || 'user',
                status: data.status || 'active',
                profileCompleted: data.profileCompleted ?? false,
                nationality: data.nationality || '',
                gender: data.gender || '',
                isMember: data.isMember || false,
                avatar: data.avatar || '/user_default.png',
                photoURL: data.photoURL || '/user_default.png',
                hasWebAccess: data.hasWebAccess ?? true,
                families: data.families || [],
                birthdate: data.birthdate || null,
            };
        });
        
        return {
            ok: true,
            users
        };
        
    } catch (error: any) {
        console.error('Error al obtener usuarios por rol:', error);
        return {
            ok: false,
            errorMessage: `Error al obtener usuarios: ${error.message}`
        };
    }
};

// === OBTENER CUMPLEAÑOS DE TODOS LOS USUARIOS ===
export interface UserBirthday {
    uid: string;
    name: string;
    birthdate: string;
}

export const getAllUsersBirthdays = async (): Promise<UserBirthday[]> => {
    try {
        const usersRef = collection(FirebaseDB, 'users');
        const snapshot = await getDocs(usersRef);
        
        const birthdays: UserBirthday[] = [];
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Solo incluir usuarios que tengan fecha de nacimiento
            if (data.birthdate) {
                const birthdateStr = typeof data.birthdate === 'string' 
                    ? data.birthdate 
                    : data.birthdate.toDate().toISOString();
                
                birthdays.push({
                    uid: doc.id,
                    name: data.name || data.displayName || 'Usuario sin nombre',
                    birthdate: birthdateStr
                });
            }
        });
        
        return birthdays;
        
    } catch (error: any) {
        console.error('Error al obtener cumpleaños:', error);
        return [];
    }
};
