import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseAuth } from '../firebase/config';

import { login, logout, setRole } from '../modules/auth/store/authSlice';
import { getRole } from '../modules/auth/firebase/authQueries';

export const useCheckAuth = () => {
 
    const { status } = useSelector( state => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        onAuthStateChanged( FirebaseAuth, async( user ) => {
            if( !user ) return dispatch( logout() );

            const { uid, email, displayName, photoURL } = user;
            dispatch( login({ uid, email, displayName, photoURL }) );

            try {
                const roleResult = await getRole({ uid });

                if (roleResult.ok) {
                    dispatch( setRole( {role: roleResult.role} ) );
                } else {
                    console.warn('No se pudo obtener el rol, usando rol por defecto:', roleResult.error);
                    dispatch( setRole( {role: 'user'} ) );
                }
            } catch (error) {
                console.error('Error obteniendo el rol del usuario:', error);
                // Establecer rol por defecto en caso de error
                dispatch( setRole( {role: 'user'} ) );
            }
        });

    }, []);
    
    return {
        status
    }
}