import { collection,  doc,  getDoc, getDocs,  setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { FirebaseDB } from '@/firebase/config';
import { CreateFamilyData, CreateFamilyResult, MemberData, AddUserToFamilyResult, RemoveUserFromFamilyResult, GetFamilyMembersResult, GetUserFamiliesResult, UpdateUserIdResult, GetUserByIdResult, FamilyMember } from '@/modules/family/types';
import type { User } from '@/types';
import { ROLES } from '@/core/helpers/roles';
import { convertDateFieldsToISO } from '@/core/helpers/dateUtils';

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
        // Ya no se agrega al creador como miembro de la familia
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
                const data = familySnap.data();
                // Convertir campos Timestamp a string
                return {
                    id: familyId,
                    ...data,
                    createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                    updatedAt: data.updatedAt && data.updatedAt.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
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
export const searchUsersToAddToFamily = async (
  familyId: string,
  searchTerm: string = '',
  currentUserId: string
): Promise<{ ok: boolean; users: any[]; errorMessage?: string }> => {
    try {
        // 1. Obtener todos los usuarios
        const usersRef = collection(FirebaseDB, 'users');
        const usersSnapshot = await getDocs(usersRef);

        // 2. Obtener miembros actuales de la familia
        const membersRef = collection(FirebaseDB, `families/${familyId}/members`);
        const membersSnapshot = await getDocs(membersRef);
        const currentMemberIds = membersSnapshot.docs.map(doc => doc.id);

        // 3. Filtrar usuarios que no están en la familia y que no sean el usuario actual
        let availableUsers: User[] = usersSnapshot.docs
            .filter(doc => !currentMemberIds.includes(doc.id))
            .filter(doc => doc.id !== currentUserId)
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

/**
 * Obtiene los familiares de un usuario (ignorando al titular)
 */
export const getFamilyByUserId = async (userId: string): Promise<FamilyMember[]> => {
    // Buscar la familia donde el usuario es el creador (createdBy)
    interface FamilyDocStrict {
        id: string;
        createdBy: string;
        [key: string]: any;
    }
    const familiesCollectionRef = collection(FirebaseDB, 'families');
    const familiesCollectionSnapshot = await getDocs(familiesCollectionRef);
    const allFamiliesList: FamilyDocStrict[] = familiesCollectionSnapshot.docs
        .map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                createdBy: typeof data.createdBy === 'string' ? data.createdBy : '',
                ...data
            };
        });
    const userOwnedFamily = allFamiliesList.find(familyItem => familyItem.createdBy === userId);

    if (userOwnedFamily) {
        // Mostrar miembros de su familia (excluyéndose a sí mismo)
        const { ok: okMembers, members } = await getFamilyMembers(userOwnedFamily.id);
        if (okMembers && members.length) {
            return members.filter(member => member.id !== userId).map(member => convertDateFieldsToISO(member));
        }
        return [];
    } else {
        // Buscar familias donde es miembro (pero no titular)
        const { ok, families } = await getUserFamilies(userId);
        if (!ok || !families.length) return [];

        let directRelations: FamilyMember[] = [];
        for (const family of families) {
            if (family.createdBy === userId) continue;
            // Solo mostrar el creador de la familia como relación directa
            const creatorId = family.createdBy;
            const creatorUser = await getUserById(creatorId);
            if (creatorUser.ok && creatorUser.user) {
                // Buscar la relación entre el usuario y el creador
                const memberRef = doc(FirebaseDB, `families/${family.id}/members`, userId);
                const memberSnap = await getDoc(memberRef);
                let relation = '';
                if (memberSnap.exists()) {
                    const memberData = memberSnap.data();
                    relation = memberData.relation || '';
                }
                directRelations.push({
                    id: creatorUser.user.id,
                    ...creatorUser.user,
                    relation,
                });
            }
        }
        // Eliminar duplicados por id
        const uniqueRelations = directRelations.filter((member, index, self) =>
            index === self.findIndex((m) => m.id === member.id)
        );
        return uniqueRelations;
    }
};

/**
 * Obtiene la familia donde el usuario es titular (createdBy) o la crea si no existe.
 */
export const getOrCreateFamilyByUserId = async (userId: string): Promise<{ ok: boolean; familyId?: string; family?: any; created?: boolean; errorMessage?: string }> => {
    try {
        const familiesCollectionRef = collection(FirebaseDB, 'families');
        const familiesCollectionSnapshot = await getDocs(familiesCollectionRef);
        const allFamiliesList = familiesCollectionSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                createdBy: typeof data.createdBy === 'string' ? data.createdBy : '',
                ...data
            };
        });
        const ownFamily = allFamiliesList.find(fam => fam.createdBy === userId);
        if (ownFamily) {
            // Asegura que el usuario tenga el id de la familia en su array families
            const userRef = doc(FirebaseDB, 'users', userId);
            await updateDoc(userRef, {
                families: [ownFamily.id],
                updatedAt: serverTimestamp()
            });
            return { ok: true, familyId: ownFamily.id, family: ownFamily, created: false };
        } else {
            const result = await createFamily({ name: 'Mi Familia' }, userId);
            if (result.ok && result.familyId) {
                const userRef = doc(FirebaseDB, 'users', userId);
                await updateDoc(userRef, {
                    families: [result.familyId],
                    updatedAt: serverTimestamp()
                });
                return { ok: true, familyId: result.familyId, family: result.family, created: true };
            } else {
                return { ok: false, errorMessage: result.errorMessage };
            }
        }
    } catch (error: any) {
        return { ok: false, errorMessage: error.message };
    }
};
