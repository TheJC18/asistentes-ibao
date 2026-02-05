import { 
    collection, 
    doc, 
    getDoc,
    getDocs, 
    setDoc,
    deleteDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { FirebaseDB } from '../../../firebase/config';

/**
 * Crear una nueva familia
 */
export const createFamily = async (familyData, creatorUserId) => {
    try {
        const familyRef = doc(collection(FirebaseDB, 'families'));
        const familyId = familyRef.id;
        
        const newFamily = {
            name: familyData.name || 'Mi Familia',
            createdBy: creatorUserId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        
        await setDoc(familyRef, newFamily);
        
        // Agregar al creador como miembro de la familia
        await addUserToFamily(familyId, creatorUserId, {
            relation: 'Titular',
            role: 'admin',
            addedBy: creatorUserId,
        });
        
        return {
            ok: true,
            familyId,
            family: newFamily
        };
    } catch (error) {
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
export const addUserToFamily = async (familyId, userId, memberData = {}) => {
    try {
        // 1. Crear documento en families/{familyId}/members/{userId}
        const memberRef = doc(FirebaseDB, `families/${familyId}/members`, userId);
        
        const memberInfo = {
            relation: memberData.relation || '',
            role: memberData.role || 'member',
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
    } catch (error) {
        console.error('Error al agregar usuario a familia:', error);
        return {
            ok: false,
            errorMessage: error.message
        };
    }
};

/**
 * Remover un usuario de una familia
 */
export const removeUserFromFamily = async (familyId, userId) => {
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
    } catch (error) {
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
export const getFamilyMembers = async (familyId) => {
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
        
        const members = (await Promise.all(membersPromises)).filter(m => m !== null);
        
        return {
            ok: true,
            members
        };
    } catch (error) {
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
export const getUserFamilies = async (userId) => {
    try {
        const userRef = doc(FirebaseDB, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            return { ok: false, families: [] };
        }
        
        const familyIds = userSnap.data().families || [];
        
        const familiesPromises = familyIds.map(async (familyId) => {
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
        
        const families = (await Promise.all(familiesPromises)).filter(f => f !== null);
        
        return {
            ok: true,
            families
        };
    } catch (error) {
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
export const updateUserIdInFamilies = async (oldUserId, newUserId, familyIds) => {
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
    } catch (error) {
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
export const getUserById = async (userId) => {
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
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return {
            ok: false,
            errorMessage: error.message
        };
    }
};
