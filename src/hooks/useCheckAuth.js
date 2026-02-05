import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseAuth } from '../firebase/config';

import { login, logout, setRole } from '../modules/auth/store/authSlice';
import { checkOrCreateUser, getUserByUID } from '../modules/auth/firebase/authQueries';

export const useCheckAuth = () => {
 
    const { status } = useSelector( state => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        onAuthStateChanged( FirebaseAuth, async( user ) => {
            if( !user ) return dispatch( logout() );

            const { uid, email, displayName, photoURL } = user;
            
            try {
                // Primero asegurar que el usuario exista en Firestore
                await checkOrCreateUser({ uid, email, displayName, photoURL });
                
                // Obtener TODOS los datos del usuario desde Firestore
                const userResult = await getUserByUID({ uid });
                
                if (userResult.ok && userResult.data) {
                    const userData = userResult.data;
                    
                    // Hacer login con TODOS los datos de una vez
                    dispatch( login({ 
                        uid, 
                        email: userData.email || email,
                        displayName: userData.displayName || displayName,
                        photoURL: userData.photoURL || photoURL,
                        birthdate: userData.birthdate || null,
                        nationality: userData.nationality || null,
                        isMember: userData.isMember || false,
                        profileCompleted: userData.profileCompleted || false
                    }) );
                    
                    // Setear el rol
                    dispatch( setRole( {role: userData.role || 'user'} ) );
                } else {
                    // Si no se pueden obtener datos, hacer login con valores básicos
                    dispatch( login({ 
                        uid, 
                        email, 
                        displayName, 
                        photoURL,
                        profileCompleted: false 
                    }) );
                    dispatch( setRole( {role: 'user'} ) );
                }
                
            } catch (error) {
                console.error('Error en el proceso de autenticación:', error);
                // En caso de error, hacer login con valores por defecto
                dispatch( login({ uid, email, displayName, photoURL, profileCompleted: false }) );
                dispatch( setRole( {role: 'user'} ) );
            }
        });

    }, []);
    
    return {
        status
    }
}