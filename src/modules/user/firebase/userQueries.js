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
    startAfter,
    getCountFromServer
} from 'firebase/firestore';
import { FirebaseDB } from '../../../firebase/config';
import { formatDateFields, convertDateFieldsToISO, dateToISOString } from '../../../helpers';

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
            
            return {
                id: doc.id,
                ...formatDateFields(data, ['createdAt', 'updatedAt']),
                // Convertir birthdate a ISO string para ser serializable
                birthdate: data.birthdate ? dateToISOString(data.birthdate) : null
            };
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
        // Preparar datos del usuario
        const newUserData = {
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date(),
            // Asegurar campos por defecto
            status: userData.status || 'active',
            role: userData.role || 'user'
        };
        
        // Crear documento en Firestore
        const usersRef = collection(FirebaseDB, 'users');
        const docRef = await addDoc(usersRef, newUserData);
        
        // Obtener el documento creado con el ID
        const createdUser = {
            id: docRef.id,
            ...convertDateFieldsToISO(newUserData, ['createdAt', 'updatedAt', 'birthdate'])
        };
        
        return {
            ok: true,
            user: createdUser
        };
        
    } catch (error) {
        console.error('Error al crear usuario en Firebase:', error);
        return {
            ok: false,
            errorMessage: `Error al crear usuario: ${error.message}`
        };
    }
};

// === ACTUALIZAR USUARIO ===
export const updateUserInFirebase = async (userId, userData) => {
    try {
        // Preparar datos de actualización
        const updateData = {
            ...userData,
            updatedAt: new Date()
        };
        
        // Actualizar documento en Firestore
        const userDocRef = doc(FirebaseDB, 'users', userId);
        await updateDoc(userDocRef, updateData);
        
        // Obtener el documento actualizado
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
export const deleteUserFromFirebase = async (userId) => {
    try {
        // Verificar que el usuario existe antes de eliminar
        const userDocRef = doc(FirebaseDB, 'users', userId);
        const userSnapshot = await getDoc(userDocRef);
        
        if (!userSnapshot.exists()) {
            return {
                ok: false,
                errorMessage: 'Usuario no encontrado'
            };
        }
        
        // Eliminar documento de Firestore
        await deleteDoc(userDocRef);
        
        return {
            ok: true
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
