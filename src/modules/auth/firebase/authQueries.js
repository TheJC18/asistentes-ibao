import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updatePassword, signOut, deleteUser, signInWithEmailAndPassword, fetchSignInMethodsForEmail, EmailAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseDB, FirebaseAuth, SecondaryFirebaseAuth } from '../../../firebase/config';

export const checkOrCreateUser = async({ uid, displayName, photoURL, email, role = 'user' }) => {
    const userRef = doc(FirebaseDB, `users/${uid}`);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        await setDoc(userRef, {
            uid,
            name: displayName || '',
            displayName: displayName || '',
            avatar: photoURL || '/user_default.png',
            photoURL: photoURL || '/user_default.png',
            email: email || '',
            role,
            status: 'active', // Por defecto activo
            hasWebAccess: true, // Tiene acceso web porque se logueó
            isMember: false, // No es miembro hasta que complete perfil
            profileCompleted: false, // Nuevo usuario siempre empieza con perfil incompleto
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            families: [], // Array de familias
        });
        
        // Crear familia automáticamente para el nuevo usuario
        const { createFamily } = await import('../../../modules/family/firebase/familyQueries');
        const userName = displayName || 'Usuario';
        await createFamily({ name: `Familia de ${userName}` }, uid);
        
        return { isNewUser: true };
    }
    
    return { isNewUser: false };
}

export const getUserByUID = async({ uid = '' }) => {
    if (!uid) throw new Error('El UID del usuario no existe.');

    try {
        const docRef = doc(FirebaseDB, `users/${uid}`);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            // No lanzar error, solo retornar que no existe
            return {
                ok: false,
                exists: false,
                error: 'El usuario no existe en la base de datos.'
            }
        }

        const data = docSnap.data();

        // Convertir timestamps a strings para evitar problemas de serialización
        const processedData = {
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
            birthdate: data.birthdate?.toDate?.()?.toISOString() || data.birthdate
        };

        return {
            ok: true,
            exists: true,
            data: processedData,
        }
    } catch (error) {
        console.error('Error en getUserByUID:', error);
        return {
            ok: false,
            exists: false,
            error: error.message
        }
    }
}

export const getRole = async({ uid = '' }) => {
    try {
        const userResult = await getUserByUID({ uid });
        
        if (!userResult.ok) {
            return {
                ok: false,
                error: userResult.error || 'No se pudo obtener el usuario.',
                role: 'user' // Rol por defecto
            }
        }

        return {
            ok: userResult.ok,
            role: userResult.data.role || 'user', // Asegurar que siempre haya un rol
        }
    } catch (error) {
        console.error('Error en getRole:', error);
        return {
            ok: false,
            error: error.message || 'Error desconocido',
            role: 'user' // Rol por defecto en caso de error
        }
    }
}

export const getProfileCompleted = async({ uid = '' }) => {
    try {
        const userResult = await getUserByUID({ uid });
        
        if (!userResult.ok) {
            return {
                ok: false,
                error: userResult.error || 'No se pudo obtener el usuario.',
                profileCompleted: false
            }
        }

        return {
            ok: userResult.ok,
            profileCompleted: userResult.data.profileCompleted || false,
        }
    } catch (error) {
        console.error('Error en getProfileCompleted:', error);
        return {
            ok: false,
            error: error.message || 'Error desconocido',
            profileCompleted: false
        }
    }
}

export const updateProfileCompleted = async({ uid, profileCompleted = true }) => {
    try {
        const userRef = doc(FirebaseDB, `users/${uid}`);
        await setDoc(userRef, { 
            profileCompleted,
            updatedAt: serverTimestamp() 
        }, { merge: true });

        return {
            ok: true,
            profileCompleted
        }
    } catch (error) {
        console.error('Error en updateProfileCompleted:', error);
        return {
            ok: false,
            error: error.message || 'Error desconocido'
        }
    }
}

// === OPERACIONES DE AUTHENTICATION ===

// Crear usuario en Firebase Authentication sin afectar la sesión del admin
export const createAuthUser = async (email, password) => {
    try {
        // Usar la instancia secundaria de Auth para crear el usuario
        // Esto NO afecta la sesión del admin en la instancia principal
        const userCredential = await createUserWithEmailAndPassword(SecondaryFirebaseAuth, email, password);
        const newUid = userCredential.user.uid;
        
        // Cerrar sesión en la instancia secundaria para limpiar
        await signOut(SecondaryFirebaseAuth);
        
        return {
            ok: true,
            uid: newUid,
            user: userCredential.user
        };
    } catch (error) {
        console.error('Error al crear usuario en Authentication:', error);
        
        let errorMessage = 'Error al crear usuario';
        
        if (error.code === 'auth/email-already-in-use') {
            return {
                ok: false,
                errorCode: 'auth/email-already-in-use',
                errorMessage: 'Este correo ya existe en Firebase Authentication',
                email: email, // 👈 Agregar el email aquí
                canCleanup: true
            };
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'El correo electrónico no es válido';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'La contraseña es muy débil. Debe tener al menos 6 caracteres';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        return {
            ok: false,
            errorMessage
        };
    }
};

// Actualizar contraseña del usuario actual
export const updateUserPassword = async (newPassword) => {
    try {
        const currentUser = FirebaseAuth.currentUser;
        
        if (!currentUser) {
            return {
                ok: false,
                errorMessage: 'No hay usuario autenticado'
            };
        }
        
        await updatePassword(currentUser, newPassword);
        
        return {
            ok: true
        };
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        
        if (error.code === 'auth/requires-recent-login') {
            return {
                ok: false,
                errorMessage: 'Para cambiar la contraseña, necesitas cerrar sesión y volver a iniciar sesión'
            };
        }
        
        return {
            ok: false,
            errorMessage: `Error al actualizar contraseña: ${error.message}`
        };
    }
};

// Cerrar sesión del usuario actual
export const signOutUser = async () => {
    try {
        await signOut(FirebaseAuth);
        return { ok: true };
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return {
            ok: false,
            errorMessage: error.message
        };
    }
};

// Eliminar usuario huérfano de Authentication
export const cleanupOrphanAuthUser = async (email, password) => {
    try {
        // Validar parámetros
        if (!email || !password) {
            return {
                ok: false,
                errorMessage: 'Email y contraseña son necesarios para eliminar el usuario huérfano'
            };
        }
        
        const currentUser = FirebaseAuth.currentUser;
        const currentUserEmail = currentUser?.email;
        
        // 1. Iniciar sesión con el usuario huérfano
        const userCredential = await signInWithEmailAndPassword(FirebaseAuth, email, password);
        
        // 2. Eliminar el usuario de Authentication
        await deleteUser(userCredential.user);
        
        console.log(`✅ Usuario huérfano ${email} eliminado de Authentication`);
        
        // 3. La sesión del admin se restaurará automáticamente vía onAuthStateChanged
        if (currentUserEmail && currentUserEmail !== email) {
            console.log(`Restaurando sesión de admin: ${currentUserEmail}`);
        }
        
        return {
            ok: true,
            message: `Usuario ${email} eliminado de Authentication`
        };
        
    } catch (error) {
        console.error('Error al limpiar usuario huérfano:', error);
        
        let errorMessage = 'Error al limpiar usuario huérfano';
        
        if (error.code === 'auth/wrong-password') {
            errorMessage = 'Contraseña incorrecta. No se puede eliminar el usuario sin la contraseña correcta';
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'El usuario ya no existe en Authentication';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        return {
            ok: false,
            errorMessage
        };
    }
};

/**
 * Verifica si un email ya está registrado en Firebase Authentication
 * Método gratuito que funciona del lado del cliente sin necesidad de Cloud Functions
 * @param {string} email - Email a verificar
 * @returns {Promise<boolean>} true si el email existe, false si no existe
 */
export const checkEmailExists = async (email) => {
    if (!email) return false;
    
    try {
        const signInMethods = await fetchSignInMethodsForEmail(FirebaseAuth, email);
        // Si retorna un array con elementos, el email está registrado
        return signInMethods.length > 0;
    } catch (error) {
        console.error('Error al verificar email:', error);
        // Si hay error, asumimos que no existe para permitir el flujo
        return false;
    }
};

/**
 * Enviar email de restablecimiento de contraseña
 * @param {string} email - Email del usuario
 * @returns {Promise<{ok: boolean, message?: string, errorMessage?: string}>}
 */
export const sendPasswordResetEmailToUser = async (email) => {
    try {
        await sendPasswordResetEmail(FirebaseAuth, email);
        return {
            ok: true,
            message: 'Email de restablecimiento enviado correctamente'
        };
    } catch (error) {
        console.error('Error al enviar email de restablecimiento:', error);
        
        let errorMessage = 'Error al enviar email de restablecimiento';
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No existe un usuario con ese correo';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'El correo electrónico no es válido';
        }
        
        return {
            ok: false,
            errorMessage
        };
    }
};
