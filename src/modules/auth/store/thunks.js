import { loginWithEmailPassword, logoutFirebase, registerUserWithEmailPassword, singInWithGoogle } from '../../../firebase/providers';
import { getRole } from '../firebase/authQueries';
import { chekingCredentials, login, logout, setRole } from './authSlice';

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

        dispatch( login( result ) );
        
        // Obtener el rol después del login
        if(result.uid) {
            try {
                await dispatch( startGetRole({ uid: result.uid }) );
            } catch (e) {
                dispatch( setRole({ role: 'user' }) );
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

        dispatch( login( { ok, uid, displayName, email, photoURL} ) );
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
        } catch (e) {
            dispatch( setRole({ role: 'user' }) );
        }
    }
}