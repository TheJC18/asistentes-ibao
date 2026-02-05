import { loginWithEmailPassword, logoutFirebase, registerUserWithEmailPassword, singInWithGoogle } from '../../../firebase/providers';
import { getRole, getProfileCompleted, updateProfileCompleted, checkOrCreateUser } from '../firebase/authQueries';
import { chekingCredentials, login, logout, setRole, setProfileCompleted } from './authSlice';

export const checkingAuthentication = () => {
    return async( dispatch ) => {
        dispatch( chekingCredentials() );
    }
}

export const startGoogleSignIn = () => {
    return async( dispatch ) => {
        dispatch( chekingCredentials() );
        const result = await singInWithGoogle();

        if (!result.ok) return dispatch( logout(result.errorMessage) );

        // Asegurar que el usuario exista en Firestore
        await checkOrCreateUser({
            uid: result.uid,
            displayName: result.displayName,
            photoURL: result.photoURL,
            email: result.email
        });

        dispatch( login( result ) );
        
        // Obtener el rol y profileCompleted después del login
        if(result.uid) {
            try {
                await dispatch( startGetRole({ uid: result.uid }) );
                await dispatch( startGetProfileCompleted({ uid: result.uid }) );
            } catch {
                dispatch( setRole({ role: 'user' }) );
                dispatch( setProfileCompleted({ profileCompleted: false }) );
            }
        }
    }
}

export const startCreatingUserWithEmailPassword = ({ displayName, email, password }) => {
    return async( dispatch ) => {
        dispatch( chekingCredentials() );

        const { ok, uid, photoURL, errorMessage} = await registerUserWithEmailPassword({ displayName, email, password });
        
        if( !ok ) return dispatch( logout({ errorMessage }) );

        dispatch( login( { ok, uid, displayName, email, photoURL} ) );
    }
}

export const startLoginWithEmailPassword = ({ email, password }) => {
    return async( dispatch ) => {
        dispatch( chekingCredentials() );

        const { ok, uid, displayName, photoURL, errorMessage} = await loginWithEmailPassword({ email, password });
        
        if( !ok ) return dispatch( logout({ errorMessage }) );

        // Asegurar que el usuario exista en Firestore
        await checkOrCreateUser({
            uid,
            displayName,
            photoURL,
            email
        });

        dispatch( login( { ok, uid, displayName, email, photoURL} ) );
        
        // Obtener profileCompleted después del login
        if(uid) {
            try {
                await dispatch( startGetProfileCompleted({ uid }) );
            } catch {
                dispatch( setProfileCompleted({ profileCompleted: false }) );
            }
        }
    }
}

export const startLogOut = () => {
    return async(dispatch) => {
        await logoutFirebase();
        dispatch( logout() );
    }
}

export const startGetRole = ({ uid }) => {
    return async(dispatch) => {
        try {
            const { ok, role } =  await getRole({ uid });
            if( !ok ) {
                dispatch( setRole({ role: 'user' }) );
            } else {
                dispatch( setRole({ role }) );
            }
        } catch {
            dispatch( setRole({ role: 'user' }) );
        }
    }
}

export const startGetProfileCompleted = ({ uid }) => {
    return async(dispatch) => {
        try {
            const { ok, profileCompleted } = await getProfileCompleted({ uid });
            if( ok ) {
                dispatch( setProfileCompleted({ profileCompleted }) );
            } else {
                dispatch( setProfileCompleted({ profileCompleted: false }) );
            }
        } catch {
            dispatch( setProfileCompleted({ profileCompleted: false }) );
        }
    }
}

export const startUpdateProfileCompleted = ({ uid, profileCompleted = true }) => {
    return async(dispatch) => {
        try {
            const result = await updateProfileCompleted({ uid, profileCompleted });
            if( result.ok ) {
                dispatch( setProfileCompleted({ profileCompleted }) );
                return { ok: true };
            }
            return { ok: false, error: result.error };
        } catch (error) {
            return { ok: false, error: error.message };
        }
    }
}