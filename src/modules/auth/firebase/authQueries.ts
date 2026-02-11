import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {  createUserWithEmailAndPassword,  updatePassword,  signOut,  deleteUser,  signInWithEmailAndPassword,  fetchSignInMethodsForEmail,  EmailAuthProvider,  sendPasswordResetEmail,  linkWithCredential,  GoogleAuthProvider,  signInWithPopup } from 'firebase/auth';
import { FirebaseDB, FirebaseAuth, SecondaryFirebaseAuth } from '@/firebase/config';
import { ROLES } from '@/core/constants/roles';
import {
  CheckOrCreateUserParams,
  CheckOrCreateUserResult,
  GetUserByUIDParams,
  GetUserByUIDResult,
  GetRoleParams,
  GetRoleResult,
  GetProfileCompletedParams,
  GetProfileCompletedResult,
  UpdateProfileCompletedParams,
  UpdateProfileCompletedResult,
  CreateAuthUserResult,
  LinkEmailPasswordResult,
  LinkGoogleAccountResult,
  UpdateUserPasswordResult,
  SignOutUserResult,
  CleanupOrphanAuthUserResult,
  SendPasswordResetEmailResult
} from '@/modules/auth/types';

export const checkOrCreateUser = async({ uid, displayName, photoURL, email, role = 'user' }: CheckOrCreateUserParams): Promise<CheckOrCreateUserResult> => {
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
            status: 'active',
            hasWebAccess: true,
            isMember: false,
            profileCompleted: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            families: [],
        });
                
        return { isNewUser: true };
    }
    
    return { isNewUser: false };
};

export const getUserByUID = async({ uid }: GetUserByUIDParams): Promise<GetUserByUIDResult> => {
    if (!uid) throw new Error('El UID del usuario no existe.');

    try {
        const docRef = doc(FirebaseDB, `users/${uid}`);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return {
                ok: false,
                exists: false,
                error: 'El usuario no existe en la base de datos.'
            };
        }

        const data = docSnap.data();

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
            user: processedData
        };
    } catch (error: any) {
        console.error('Error en getUserByUID:', error);
        return {
            ok: false,
            exists: false,
            error: error.message
        };
    }
};

export const getRole = async({ uid }: GetRoleParams): Promise<GetRoleResult> => {
    try {
        const userResult = await getUserByUID({ uid });
        
        if (!userResult.ok) {
            return {
                ok: false,
                error: userResult.error || 'No se pudo obtener el usuario.',
                role: ROLES.USER
            };
        }

        return {
            ok: userResult.ok,
            role: userResult.data.role || ROLES.USER,
        };
    } catch (error: any) {
        console.error('Error en getRole:', error);
        return {
            ok: false,
            error: error.message || 'Error desconocido',
            role: ROLES.USER
        };
    }
};

export const getProfileCompleted = async({ uid }: GetProfileCompletedParams): Promise<GetProfileCompletedResult> => {
    try {
        const userResult = await getUserByUID({ uid });
        
        if (!userResult.ok) {
            return {
                ok: false,
                error: userResult.error || 'No se pudo obtener el usuario.',
                profileCompleted: false
            };
        }

        return {
            ok: userResult.ok,
            profileCompleted: userResult.data.profileCompleted || false,
        };
    } catch (error: any) {
        console.error('Error en getProfileCompleted:', error);
        return {
            ok: false,
            error: error.message || 'Error desconocido',
            profileCompleted: false
        };
    }
};

export const updateProfileCompleted = async({ uid, profileCompleted = true }: UpdateProfileCompletedParams): Promise<UpdateProfileCompletedResult> => {
    try {
        const userRef = doc(FirebaseDB, `users/${uid}`);
        await setDoc(userRef, { 
            profileCompleted,
            updatedAt: serverTimestamp() 
        }, { merge: true });

        return {
            ok: true,
            profileCompleted
        };
    } catch (error: any) {
        console.error('Error en updateProfileCompleted:', error);
        return {
            ok: false,
            error: error.message || 'Error desconocido'
        };
    }
};

export const createAuthUser = async (email: string, password: string): Promise<CreateAuthUserResult> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(SecondaryFirebaseAuth, email, password);
        const newUid = userCredential.user.uid;
        
        await signOut(SecondaryFirebaseAuth);
        
        return {
            ok: true,
            uid: newUid,
            user: userCredential.user
        };
    } catch (error: any) {
        console.error('Error al crear usuario en Authentication:', error);
        
        let errorMessage = 'Error al crear usuario';
        
        if (error.code === 'auth/email-already-in-use') {
            return {
                ok: false,
                errorCode: 'auth/email-already-in-use',
                errorMessage: 'Este correo ya existe en Firebase Authentication',
                email: email,
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

export const linkEmailPassword = async (email: string, password: string): Promise<LinkEmailPasswordResult> => {
    try {
        const currentUser = FirebaseAuth.currentUser;
        
        if (!currentUser) {
            return {
                ok: false,
                errorMessage: 'No hay usuario autenticado'
            };
        }
        
        const hasPasswordProvider = currentUser.providerData.some(
            provider => provider.providerId === 'password'
        );
        
        if (hasPasswordProvider) {
            return {
                ok: false,
                errorMessage: 'Este usuario ya tiene credenciales de email/contraseña',
                alreadyLinked: true
            };
        }
        
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(currentUser, credential);
        
        return {
            ok: true,
            message: 'Credenciales vinculadas correctamente'
        };
    } catch (error: any) {
        console.error('Error al vincular credenciales:', error);
        
        if (error.code === 'auth/email-already-in-use') {
            return {
                ok: false,
                errorMessage: 'Este email ya está en uso por otra cuenta'
            };
        }
        
        if (error.code === 'auth/provider-already-linked') {
            return {
                ok: false,
                errorMessage: 'Las credenciales ya están vinculadas'
            };
        }
        
        if (error.code === 'auth/requires-recent-login') {
            return {
                ok: false,
                errorCode: 'auth/requires-recent-login',
                errorMessage: 'Por seguridad, tu sesión es muy antigua. Debes cerrar sesión y volver a iniciar sesión para realizar esta acción.',
                requiresReauth: true
            };
        }
        
        return {
            ok: false,
            errorCode: error.code || 'unknown',
            errorMessage: `Error al vincular credenciales: ${error.message}`
        };
    }
};

export const linkGoogleAccount = async (): Promise<LinkGoogleAccountResult> => {
    try {
        const currentUser = FirebaseAuth.currentUser;
        
        if (!currentUser) {
            return {
                ok: false,
                errorMessage: 'No hay usuario autenticado'
            };
        }
        
        const hasGoogleProvider = currentUser.providerData.some(
            provider => provider.providerId === 'google.com'
        );
        
        if (hasGoogleProvider) {
            return {
                ok: false,
                errorMessage: 'Este usuario ya tiene Google vinculado',
                alreadyLinked: true
            };
        }
        
        const googleProvider = new GoogleAuthProvider();
        const result = await signInWithPopup(FirebaseAuth, googleProvider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        
        if (!credential) {
            return {
                ok: false,
                errorMessage: 'No se pudo obtener las credenciales de Google'
            };
        }
        
        await linkWithCredential(currentUser, credential);
        
        return {
            ok: true,
            message: 'Cuenta de Google vinculada correctamente'
        };
    } catch (error: any) {
        console.error('Error al vincular Google:', error);
        
        if (error.code === 'auth/credential-already-in-use') {
            return {
                ok: false,
                errorMessage: 'Esta cuenta de Google ya está vinculada a otro usuario'
            };
        }
        
        if (error.code === 'auth/provider-already-linked') {
            return {
                ok: false,
                errorMessage: 'Google ya está vinculado a esta cuenta'
            };
        }
        
        if (error.code === 'auth/requires-recent-login') {
            return {
                ok: false,
                errorCode: 'auth/requires-recent-login',
                errorMessage: 'Por seguridad, tu sesión es muy antigua. Debes cerrar sesión y volver a iniciar sesión para realizar esta acción.',
                requiresReauth: true
            };
        }
        
        return {
            ok: false,
            errorCode: error.code || 'unknown',
            errorMessage: `Error al vincular Google: ${error.message}`
        };
    }
};

export const updateUserPassword = async (newPassword: string): Promise<UpdateUserPasswordResult> => {
    try {
        const currentUser = FirebaseAuth.currentUser;
        
        if (!currentUser) {
            return {
                ok: false,
                errorCode: 'no-user',
                errorMessage: 'No hay usuario autenticado'
            };
        }
        
        await updatePassword(currentUser, newPassword);
        
        return {
            ok: true
        };
    } catch (error: any) {
        console.error('Error al actualizar contraseña:', error);
        
        if (error.code === 'auth/requires-recent-login') {
            return {
                ok: false,
                errorCode: 'auth/requires-recent-login',
                errorMessage: 'Por seguridad, tu sesión es muy antigua. Debes cerrar sesión y volver a iniciar sesión para cambiar tu contraseña.',
                requiresReauth: true
            };
        }
        
        if (error.code === 'auth/weak-password') {
            return {
                ok: false,
                errorCode: 'auth/weak-password',
                errorMessage: 'La contraseña es muy débil. Debe tener al menos 6 caracteres.'
            };
        }
        
        return {
            ok: false,
            errorCode: error.code || 'unknown',
            errorMessage: `Error al actualizar contraseña: ${error.message}`
        };
    }
};

export const signOutUser = async (): Promise<SignOutUserResult> => {
    try {
        await signOut(FirebaseAuth);
        return { ok: true };
    } catch (error: any) {
        console.error('Error al cerrar sesión:', error);
        return {
            ok: false,
            errorMessage: error.message
        };
    }
};

export const cleanupOrphanAuthUser = async (email: string, password: string): Promise<CleanupOrphanAuthUserResult> => {
    try {
        if (!email || !password) {
            return {
                ok: false,
                errorMessage: 'Email y contraseña son necesarios para eliminar el usuario huérfano'
            };
        }
        
        const userCredential = await signInWithEmailAndPassword(FirebaseAuth, email, password);
        await deleteUser(userCredential.user);
        
        return {
            ok: true,
            message: `Usuario ${email} eliminado de Authentication`
        };
        
    } catch (error: any) {
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

export const checkEmailExists = async (email: string): Promise<boolean> => {
    if (!email) return false;
    
    try {
        const signInMethods = await fetchSignInMethodsForEmail(FirebaseAuth, email);
        return signInMethods.length > 0;
    } catch (error) {
        console.error('Error al verificar email:', error);
        return false;
    }
};

export const sendPasswordResetEmailToUser = async (email: string): Promise<SendPasswordResetEmailResult> => {
    try {
        await sendPasswordResetEmail(FirebaseAuth, email);
        return {
            ok: true,
            message: 'Email de restablecimiento enviado correctamente'
        };
    } catch (error: any) {
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