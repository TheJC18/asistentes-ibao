import { collection,  doc,  getDoc, getDocs,  setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { FirebaseDB } from '@/firebase/config';
import { CreateFamilyData, CreateFamilyResult, MemberData, AddUserToFamilyResult, RemoveUserFromFamilyResult, GetFamilyMembersResult, GetUserFamiliesResult, UpdateUserIdResult, GetUserByIdResult } from '@/modules/family/types';
import type { User } from '@/types';
import { ROLES } from '@/core/constants/roles';

/**
 * Crear una nueva familia
 */
export const createFamily = async (familyData: CreateFamilyData, creatorUserId: string): Promise<CreateFamilyResult> => {
    try {
        const familyRef = doc(collection(FirebaseDB, 'families'));
        const familyId = familyRef.id;
        
        const newFamily = {
            id: familyId,
            name: familyData.name || 'Mi Familia',
            createdBy: creatorUserId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        
        await setDoc(familyRef, newFamily);
        
        // Agregar al creador como miembro de la familia
        await addUserToFamily(familyId, creatorUserId, {
            relation: 'Titular',
            role: ROLES.ADMIN,
            addedBy: creatorUserId,
        });
        
        return {
            ok: true,
            familyId,
            family: newFamily
        };
    } catch (error: any) {
        console.error('Error al crear familia:', error);
        return {
            ok: false,
            errorMessage: error.message
        };
    }
};

/**
 * Agregar un usuario existente a una familia
 */
export const addUserToFamily = async ( familyId: string, userId: string, memberData: MemberData = {} ): Promise<AddUserToFamilyResult> => {
    try {
        // 1. Crear documento en families/{familyId}/members/{userId}
        const memberRef = doc(FirebaseDB, `families/${familyId}/members`, userId);
        
        const memberInfo = {
            relation: memberData.relation || '',
            role: memberData.role || ROLES.USER,
            addedBy: memberData.addedBy || userId,
            joinedAt: serverTimestamp(),
            ...memberData
        };
        
        await setDoc(memberRef, memberInfo);
        
        // 2. Actualizar array de families en users/{userId}
        const userRef = doc(FirebaseDB, 'users', userId);
        await updateDoc(userRef, {
            families: arrayUnion(familyId),
            updatedAt: serverTimestamp()
        });
        
        return {
            ok: true,
            message: 'Usuario agregado a la familia correctamente'
        };
    } catch (error: any) {
        console.error('Error al agregar usuario a familia:', error);
        return {
            ok: false,
            errorMessage: error.message
        };
    }
};

/**
 * Actualizar datos de un miembro de la familia (incluyendo relación)
 */
export const updateFamilyMember = async ( familyId: string, userId: string, memberData: Partial<MemberData> ): Promise<AddUserToFamilyResult> => {
    try {
        const memberRef = doc(FirebaseDB, `families/${familyId}/members`, userId);
        
        const updateData = {
            ...memberData,
            updatedAt: serverTimestamp()
        };
        
                if (updateData.role && typeof updateData.role === 'string' && updateData.role !== ROLES.ADMIN && updateData.role !== ROLES.USER) {
                    updateData.role = ROLES.USER;
                }
                await updateDoc(memberRef, updateData);
        
        return {
            ok: true,
            message: 'Miembro de la familia actualizado correctamente'
        };
    } catch (error: any) {
        console.error('Error al actualizar miembro de familia:', error);
        return {
            ok: false,
            errorMessage: error.message
        };
    }
};

/**
 * Remover un usuario de una familia
 */
export const removeUserFromFamily = async (familyId: string, userId: string): Promise<RemoveUserFromFamilyResult> => {
    try {
        // 1. Eliminar de families/{familyId}/members/{userId}
        const memberRef = doc(FirebaseDB, `families/${familyId}/members`, userId);
        await deleteDoc(memberRef);
        
        // 2. Remover familyId del array families en users/{userId}
        const userRef = doc(FirebaseDB, 'users', userId);
        await updateDoc(userRef, {
            families: arrayRemove(familyId),
            updatedAt: serverTimestamp()
        });
        
        return {
            ok: true,
            message: 'Usuario removido de la familia'
        };
    } catch (error: any) {
        console.error('Error al remover usuario de familia:', error);
        return {
            ok: false,
            errorMessage: error.message
        };
    }
};

/**
 * Obtener miembros de una familia
 */
export const getFamilyMembers = async (familyId: string): Promise<GetFamilyMembersResult> => {
    try {
        const membersRef = collection(FirebaseDB, `families/${familyId}/members`);
        const membersSnapshot = await getDocs(membersRef);
        
        // Obtener datos completos de cada usuario
        const membersPromises = membersSnapshot.docs.map(async (memberDoc) => {
            const userId = memberDoc.id;
            const memberData = memberDoc.data();
            
            // Obtener datos del usuario
            const userRef = doc(FirebaseDB, 'users', userId);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                return {
                    id: userId,
                    ...userSnap.data(),
                    relation: memberData.relation,
                    role: memberData.role,
                    joinedAt: memberData.joinedAt,
                };
            }
            return null;
        });
        
        const members = (await Promise.all(membersPromises)).filter(m => m !== null) as any[];
        
        return {
            ok: true,
            members
        };
    } catch (error: any) {
        console.error('Error al obtener miembros de familia:', error);
        return {
            ok: false,
            errorMessage: error.message,
            members: []
        };
    }
};

/**
 * Obtener familias de un usuario
 */
export const getUserFamilies = async (userId: string): Promise<GetUserFamiliesResult> => {
    try {
        const userRef = doc(FirebaseDB, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            return { ok: false, families: [] };
        }
        
        const familyIds = userSnap.data().families || [];
        
        const familiesPromises = familyIds.map(async (familyId: string) => {
            const familyRef = doc(FirebaseDB, 'families', familyId);
            const familySnap = await getDoc(familyRef);
            
            if (familySnap.exists()) {
                return {
                    id: familyId,
                    ...familySnap.data()
                };
            }
            return null;
        });
        
        const families = (await Promise.all(familiesPromises)).filter(f => f !== null) as any[];
        
        return {
            ok: true,
            families
        };
    } catch (error: any) {
        console.error('Error al obtener familias del usuario:', error);
        return {
            ok: false,
            errorMessage: error.message,
            families: []
        };
    }
};

/**
 * Actualizar el userId en todas las familias cuando se migra de Firestore UID a Auth UID
 */
export const updateUserIdInFamilies = async ( oldUserId: string,  newUserId: string,  familyIds: string[] ): Promise<UpdateUserIdResult> => {
    try {
        const updatePromises = familyIds.map(async (familyId) => {
            // 1. Obtener datos del miembro con el oldUserId
            const oldMemberRef = doc(FirebaseDB, `families/${familyId}/members`, oldUserId);
            const oldMemberSnap = await getDoc(oldMemberRef);
            
            if (oldMemberSnap.exists()) {
                const memberData = oldMemberSnap.data();
                
                // 2. Crear nuevo documento con el newUserId
                const newMemberRef = doc(FirebaseDB, `families/${familyId}/members`, newUserId);
                await setDoc(newMemberRef, memberData);
                
                // 3. Eliminar el documento viejo
                await deleteDoc(oldMemberRef);
            }
            
            // 4. Actualizar la referencia en el array de familias (si es el creador)
            const familyRef = doc(FirebaseDB, 'families', familyId);
            const familySnap = await getDoc(familyRef);
            
            if (familySnap.exists()) {
                const familyData = familySnap.data();
                if (familyData.createdBy === oldUserId) {
                    await updateDoc(familyRef, {
                        createdBy: newUserId,
                        updatedAt: serverTimestamp()
                    });
                }
            }
        });
        
        await Promise.all(updatePromises);
        
        return { ok: true };
    } catch (error: any) {
        console.error('Error al actualizar userId en familias:', error);
        return {
            ok: false,
            errorMessage: error.message
        };
    }
};

/**
 * Obtener usuario por ID
 */
export const getUserById = async (userId: string): Promise<GetUserByIdResult> => {
    try {
        const userRef = doc(FirebaseDB, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            return { 
                ok: false, 
                errorMessage: 'Usuario no encontrado' 
            };
        }
        
        return {
            ok: true,
            user: {
                id: userSnap.id,
                ...userSnap.data()
            }
        };
    } catch (error: any) {
        console.error('Error al obtener usuario:', error);
        return {
            ok: false,
            errorMessage: error.message
        };
    }
};

/**
 * Eliminar familiar con lógica inteligente
 * Si el usuario solo está en esta familia, lo elimina completamente
 * Si está en otras familias, solo lo remueve de esta familia
 */
export const deleteFamilyMember = async (familyId: string, userId: string): Promise<RemoveUserFromFamilyResult> => {
    try {
        // 1. Obtener las familias del usuario
        const userRef = doc(FirebaseDB, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            return {
                ok: false,
                errorMessage: 'Usuario no encontrado'
            };
        }
        
        const userData = userSnap.data();
        const userFamilies = userData.families || [];
        
        // 2. Verificar si el usuario está en otras familias
        if (userFamilies.length <= 1) {
            // Solo está en esta familia → Eliminar usuario completamente
            
            // Eliminar de la familia
            const memberRef = doc(FirebaseDB, `families/${familyId}/members`, userId);
            await deleteDoc(memberRef);
            
            // Eliminar usuario de la colección users
            await deleteDoc(userRef);
            
            return {
                ok: true,
                message: 'Usuario eliminado completamente (no pertenecía a otras familias)'
            };
        } else {
            // Está en otras familias → Solo remover de esta familia
            
            // Eliminar de families/{familyId}/members/{userId}
            const memberRef = doc(FirebaseDB, `families/${familyId}/members`, userId);
            await deleteDoc(memberRef);
            
            // Remover familyId del array families en users/{userId}
            await updateDoc(userRef, {
                families: arrayRemove(familyId),
                updatedAt: serverTimestamp()
            });
            
            return {
                ok: true,
                message: 'Usuario removido de la familia (aún pertenece a otras familias)'
            };
        }
    } catch (error: any) {
        console.error('Error al eliminar familiar:', error);
        return {
            ok: false,
            errorMessage: error.message
        };
    }
};

/**
 * Buscar usuarios disponibles para agregar a la familia
 */
export const searchUsersToAddToFamily = async (familyId: string, searchTerm: string = ''): Promise<{ ok: boolean; users: any[]; errorMessage?: string }> => {
    try {
        // 1. Obtener todos los usuarios
        const usersRef = collection(FirebaseDB, 'users');
        const usersSnapshot = await getDocs(usersRef);
        
        // 2. Obtener miembros actuales de la familia
        const membersRef = collection(FirebaseDB, `families/${familyId}/members`);
        const membersSnapshot = await getDocs(membersRef);
        const currentMemberIds = membersSnapshot.docs.map(doc => doc.id);
        
        // 3. Filtrar usuarios que no están en la familia
        let availableUsers: User[] = usersSnapshot.docs
            .filter(doc => !currentMemberIds.includes(doc.id))
            .map(doc => {
                const data = doc.data() as Partial<User>;
                return {
                    id: doc.id,
                    name: data.name ?? '',
                    role: data.role ?? ROLES.USER,
                    email: data.email ?? '',
                    avatar: data.avatar ?? '/user_default.png',
                    photoURL: data.photoURL ?? '/user_default.png',
                    displayName: data.displayName ?? '',
                    gender: data.gender ?? '',
                    birthdate: data.birthdate ?? '',
                    nationality: data.nationality ?? '',
                    phone: data.phone ?? '',
                    isMember: data.isMember ?? false,
                    hasWebAccess: data.hasWebAccess ?? false,
                    profileCompleted: data.profileCompleted ?? false,
                    status: data.status ?? 'active',
                    families: data.families ?? [],
                    relation: data.relation ?? '',
                    createdAt: data.createdAt ?? '',
                    updatedAt: data.updatedAt ?? '',
                    ...data
                } as User;
            });
        // 4. Aplicar búsqueda si hay término
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            availableUsers = availableUsers.filter(user => {
                const name = (user.name || '').toLowerCase();
                const email = (user.email || '').toLowerCase();
                return name.includes(term) || email.includes(term);
            });
        }
        
        // 5. Ordenar por nombre
        availableUsers.sort((userA, userB) => {
            const nameA = (userA.name || '').toLowerCase();
            const nameB = (userB.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });
        
        return {
            ok: true,
            users: availableUsers
        };
    } catch (error: any) {
        console.error('Error al buscar usuarios:', error);
        return {
            ok: false,
            users: [],
            errorMessage: error.message
        };
    }
};