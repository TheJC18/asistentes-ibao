import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { FirebaseAuth } from './config';
import { checkOrCreateUser } from '../modules/auth/firebase/authQueries';

const googleProvider = new GoogleAuthProvider();

//Registro e incio de sesión con Google
export const singInWithGoogle = async() => {

    try {
        
        const result = await signInWithPopup(FirebaseAuth, googleProvider );
        // const credentials = GoogleAuthProvider.credentialFromResult( result );
        const { displayName, email, photoURL, uid } = result.user;
        
        // Guardar en Firestore
        await checkOrCreateUser({ uid, displayName, photoURL, email });

        return {
            ok: true,
            // User info
            displayName, email, photoURL, uid
        }
        

    } catch (error) {
        
        const errorMessage = error.message;
    
        return {
            ok: false,
            errorMessage,
        }
    }

}

//Registro e inicio de sesión con correo y contraseña
export const registerUserWithEmailPassword = async({ email, password, displayName }) => {

    try {
        const resp = await createUserWithEmailAndPassword( FirebaseAuth, email, password );
        const { uid, photoURL } = resp.user;

        await updateProfile( FirebaseAuth.currentUser, { displayName });
        
        // Guardar en Firestore
        await checkOrCreateUser({ uid, displayName, photoURL, email });

        return {
            ok: true,
            uid, photoURL, email, displayName
        }

    } catch (error) {
        return { ok: false, errorMessage: error.message }
    }

}

//Inicio de sesión con correo y contraseña
export const loginWithEmailPassword = async({ email, password }) => {

    try {
        const resp = await signInWithEmailAndPassword( FirebaseAuth, email, password );
        const { uid, photoURL, displayName } = resp.user;

        return {
            ok: true,
            uid, photoURL, displayName
        }

    } catch (error) {
        return { ok: false, errorMessage: error.message }
    }

}

// Cierrar sesión de Firebase
export const logoutFirebase = async() => {

    try {

        await FirebaseAuth.signOut();
        return { ok: true };

    } catch (error) {

        return { ok: false, errorMessage: error.message };

    }

}