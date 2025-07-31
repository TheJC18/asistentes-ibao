import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FirebaseDB } from '../../../firebase/config';

export const checkOrCreateUser = async({ uid, displayName, photoURL, email, role = 'user' }) => {
    const userRef = doc(FirebaseDB, `users/${uid}`);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        await setDoc(userRef, {
            uid,
            displayName,
            photoURL,
            email,
            role,
            createdAt: serverTimestamp(),
        });
    }
}

export const getUserByUID = async({ uid = '' }) => {
    if (!uid) throw new Error('El UID del usuario no existe.');

    try {
        const docRef = doc(FirebaseDB, `users/${uid}`);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('El usuario no existe en la base de datos.');
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
            data: processedData,
        }
    } catch (error) {
        console.error('Error en getUserByUID:', error);
        return {
            ok: false,
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
