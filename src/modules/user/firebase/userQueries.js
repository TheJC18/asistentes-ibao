import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    getCountFromServer,
    setDoc
} from 'firebase/firestore';
import { FirebaseDB } from '../../../firebase/config';
import { createAuthUser, cleanupOrphanAuthUser, updateUserPassword, checkEmailExists } from '../../auth/firebase/authQueries';
import { formatDateFields, convertDateFieldsToISO, dateToISOString, getInverseRelation } from '../../../helpers';

// === OBTENER LISTA DE USUARIOS ===
export const getUsersFromFirebase = async (params = {}) => {
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
        
        // Construir query base
        let q = query(usersRef);
        
        // Aplicar filtros
        if (role) {
            q = query(q, where('role', '==', role));
        }
        
        if (status !== 'all') {
            q = query(q, where('status', '==', status));
        }
        
        // Ordenar por fecha de creación (más recientes primero)
        q = query(q, orderBy('createdAt', 'desc'));
        
        // Aplicar límite
        q = query(q, limit(pageLimit));
        
        // Si no es la primera página, aplicar paginación
        // Nota: Para paginación real con Firestore, necesitarías guardar el último documento
        // Por simplicidad, aquí implementamos una versión básica
        
        // Obtener documentos
        const querySnapshot = await getDocs(q);
        
        // Mapear documentos a objetos
        let users = querySnapshot.docs.map(doc => {
            const data = doc.data();
            
            const userData = {
                id: doc.id,
                ...formatDateFields(data, ['createdAt', 'updatedAt']),
                // Convertir birthdate a ISO string para ser serializable
                birthdate: data.birthdate ? dateToISOString(data.birthdate) : null,
                // Asegurar que todos los campos importantes estén incluidos
                profileCompleted: data.profileCompleted ?? false,
                role: data.role || 'user',
                name: data.name || data.displayName || '',
                displayName: data.displayName || data.name || '',
                email: data.email || '',
                nationality: data.nationality || '',
                isMember: data.isMember || false,
                avatar: data.avatar || data.photoURL || '/user_default.png',
                photoURL: data.photoURL || data.avatar || '/user_default.png',
            };
            
            return userData;
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
        
    } catch (error) {
        console.error('Error al obtener usuarios de Firebase:', error);
        return {
            ok: false,
            errorMessage: `Error al cargar usuarios: ${error.message}`
        };
    }
};

// === OBTENER USUARIO POR ID ===
export const getUserByIdFromFirebase = async (userId) => {
    try {
        const userDocRef = doc(FirebaseDB, 'users', userId);
        const userSnapshot = await getDoc(userDocRef);
        
        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const user = {
                id: userSnapshot.id,
                ...formatDateFields(userData, ['createdAt', 'updatedAt']),
                // Convertir birthdate a ISO string para ser serializable
                birthdate: userData.birthdate ? dateToISOString(userData.birthdate) : null
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
        
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        return {
            ok: false,
            errorMessage: `Error al cargar usuario: ${error.message}`
        };
    }
};

// === CREAR USUARIO ===
export const createUserInFirebase = async (userData) => {
    try {
        const hasWebAccess = userData.hasWebAccess !== false; // Por defecto true
        
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
            const { password, familyId, relation, ...userDataWithoutPassword } = userData;
            
            const newUserData = {
                ...userDataWithoutPassword,
                uid,
                name: userData.name || userData.displayName || '',
                displayName: userData.displayName || userData.name || '',
                createdAt: new Date(),
                updatedAt: new Date(),
                profileCompleted: false,
                status: userData.status || 'active',
                role: userData.role || 'user',
                avatar: userData.avatar || userData.photoURL || '/user_default.png',
                photoURL: userData.photoURL || userData.avatar || '/user_default.png',
                hasWebAccess: true, // Tiene acceso web
                families: [], // Array de IDs de familias a las que pertenece
            };
            
            // 3. Crear documento en Firestore
            const userDocRef = doc(FirebaseDB, 'users', uid);
            await setDoc(userDocRef, newUserData);
            
            // 4. Crear familia propia del usuario (siempre)
            const { createFamily, addUserToFamily, getUserById } = await import('../../family/firebase/familyQueries');
            const userName = userData.name || userData.displayName || 'Usuario';
            const ownFamilyResult = await createFamily({ name: `Familia de ${userName}` }, uid);
            const ownFamilyId = ownFamilyResult.familyId;
            
            // 5. Si se proporcionó familyId, agregar a esa familia Y traer al titular a mi familia
            if (familyId && relation) {
                const currentUserId = userData.createdBy || uid;
                
                // Agregar el nuevo usuario a la familia del creador
                await addUserToFamily(familyId, uid, {
                    relation,
                    role: 'member',
                    addedBy: currentUserId
                });
                
                // Obtener el titular de esa familia (quien lo agregó)
                const titularData = await getUserById(currentUserId);
                if (titularData.ok && titularData.user) {
                    // Agregar al titular a MI familia (relación bidireccional)
                    // Obtener el género del nuevo usuario para determinar la relación inversa
                    const newUserGender = userData.gender || 'male'; // Por defecto masculino si no se especifica
                    const inverseRelation = getInverseRelation(relation, newUserGender);
                    
                    await addUserToFamily(ownFamilyId, currentUserId, {
                        relation: inverseRelation,
                        role: 'member',
                        addedBy: uid
                    });
                }
            }
            
            // 5. Retornar usuario creado
            const createdUser = {
                id: uid,
                ...convertDateFieldsToISO(newUserData, ['createdAt', 'updatedAt', 'birthdate'])
            };
            
            return {
                ok: true,
                user: createdUser,
                message: 'Usuario creado correctamente. Ahora puede iniciar sesión.'
            };
        } 
        
        // Sin acceso web - solo guardar en Firestore (familiar sin login)
        else {
            const { password, familyId, relation, ...userDataWithoutPassword } = userData;
            
            // Generar ID único para el documento
            const userDocRef = doc(collection(FirebaseDB, 'users'));
            const uid = userDocRef.id;
            
            const newUserData = {
                ...userDataWithoutPassword,
                uid,
                name: userData.name || userData.displayName || '',
                displayName: userData.displayName || userData.name || '',
                createdAt: new Date(),
                updatedAt: new Date(),
                profileCompleted: false,
                status: userData.status || 'active',
                role: userData.role || 'user',
                avatar: userData.avatar || userData.photoURL || '/user_default.png',
                photoURL: userData.photoURL || userData.avatar || '/user_default.png',
                hasWebAccess: false, // NO tiene acceso web
                families: [], // Array de IDs de familias a las que pertenece
            };
            
            // Crear documento en Firestore
            await setDoc(userDocRef, newUserData);
            
            // Crear familia propia del usuario (siempre)
            const { createFamily, addUserToFamily, getUserById } = await import('../../family/firebase/familyQueries');
            const userName = userData.name || userData.displayName || 'Usuario';
            const ownFamilyResult = await createFamily({ name: `Familia de ${userName}` }, uid);
            const ownFamilyId = ownFamilyResult.familyId;
            
            // Si se proporcionó familyId, agregar a esa familia Y traer al titular a mi familia
            if (familyId && relation) {
                const currentUserId = userData.createdBy || uid;
                
                // Agregar el nuevo usuario a la familia del creador
                await addUserToFamily(familyId, uid, {
                    relation,
                    role: 'member',
                    addedBy: currentUserId
                });
                
                // Obtener el titular de esa familia (quien lo agregó)
                const titularData = await getUserById(currentUserId);
                if (titularData.ok && titularData.user) {
                    // Agregar al titular a MI familia (relación bidireccional)
                    // Obtener el género del nuevo usuario para determinar la relación inversa
                    const newUserGender = userData.gender || 'male'; // Por defecto masculino si no se especifica
                    const inverseRelation = getInverseRelation(relation, newUserGender);
                    
                    await addUserToFamily(ownFamilyId, currentUserId, {
                        relation: inverseRelation,
                        role: 'member',
                        addedBy: uid
                    });
                }
            }
            
            // Retornar usuario creado
            const createdUser = {
                id: uid,
                ...convertDateFieldsToISO(newUserData, ['createdAt', 'updatedAt', 'birthdate'])
            };
            
            return {
                ok: true,
                user: createdUser,
                message: 'Familiar agregado correctamente.'
            };
        }
        
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return {
            ok: false,
            errorMessage: error.message || 'Error al crear usuario'
        };
    }
};

// === ACTUALIZAR USUARIO ===
export const updateUserInFirebase = async (userId, userData) => {
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
        const isWebAccessNowEnabled = userData.hasWebAccess !== false;
        
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
            
            const newAuthUid = authResult.uid;
            
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
                const { updateUserIdInFamilies } = await import('../../family/firebase/familyQueries');
                await updateUserIdInFamilies(userId, newAuthUid, currentUserData.families);
            }
            
            // 3. Eliminar el documento viejo
            await deleteDoc(userDocRef);
            
            // 4. Obtener el usuario migrado
            const migratedSnapshot = await getDoc(newUserDocRef);
            const migratedUserData = migratedSnapshot.data();
            const migratedUser = {
                id: migratedSnapshot.id,
                ...convertDateFieldsToISO(migratedUserData, ['createdAt', 'updatedAt', 'birthdate'])
            };
            
            return {
                ok: true,
                user: migratedUser,
                migrated: true, // Indicador de que se migró
                oldId: userId,
                newId: newAuthUid
            };
        }
        // CASO 2: Usuario YA tenía acceso web y quiere cambiar contraseña
        else if (wasWebAccessEnabled && password && password.trim() !== '') {
            const passwordResult = await updateUserPassword(password);
            if (!passwordResult.ok) {
                return passwordResult;
            }
        }
        
        // Preparar datos para Firestore (sin contraseña)
        const updateData = {
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
            const updatedUser = {
                id: updatedSnapshot.id,
                ...convertDateFieldsToISO(updatedUserData, ['createdAt', 'updatedAt', 'birthdate'])
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
        
    } catch (error) {
        console.error('Error al actualizar usuario en Firebase:', error);
        return {
            ok: false,
            errorMessage: `Error al actualizar usuario: ${error.message}`
        };
    }
};

// === ELIMINAR USUARIO ===
// Solo elimina de Firestore. Authentication debe eliminarse manualmente o con Cloud Functions
export const deleteUserFromFirebase = async (userId) => {
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
            const { removeUserFromFamily } = await import('../../family/firebase/familyQueries');
            
            const deletePromises = userFamilies.map(async (familyId) => {
                try {
                    await removeUserFromFamily(familyId, userId);
                    console.log(`Usuario ${userId} eliminado de familia ${familyId}`);
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
        
    } catch (error) {
        console.error('Error al eliminar usuario de Firebase:', error);
        return {
            ok: false,
            errorMessage: `Error al eliminar usuario: ${error.message}`
        };
    }
};

// === FUNCIONES AUXILIARES ===

// Buscar usuarios por email (útil para validaciones)
export const findUserByEmail = async (email) => {
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
        
    } catch (error) {
        console.error('Error al buscar usuario por email:', error);
        return {
            ok: false,
            errorMessage: `Error en la búsqueda: ${error.message}`
        };
    }
};

// Obtener usuarios por rol
export const getUsersByRole = async (role) => {
    try {
        const usersRef = collection(FirebaseDB, 'users');
        const q = query(usersRef, where('role', '==', role), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const users = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...convertDateFieldsToISO(data, ['createdAt', 'updatedAt', 'birthdate'])
            };
        });
        
        return {
            ok: true,
            users
        };
        
    } catch (error) {
        console.error('Error al obtener usuarios por rol:', error);
        return {
            ok: false,
            errorMessage: `Error al obtener usuarios: ${error.message}`
        };
    }
};