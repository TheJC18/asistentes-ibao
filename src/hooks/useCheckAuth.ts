import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { FirebaseAuth } from '../firebase/config';
import { login, logout, setRole } from '../modules/auth/store/authSlice';
import { checkOrCreateUser, getUserByUID } from '../modules/auth/firebase/authQueries';
import { RootState, AppDispatch } from '../store/store';

export const useCheckAuth = () => {
  const { status } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, async (user: FirebaseUser | null) => {
      if (!user) {
        return dispatch(logout({ errorMessage: null }));
      }

      try {
        // Primero asegurar que el usuario exista en Firestore
        await checkOrCreateUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || ''
        });

        // Obtener TODOS los datos del usuario desde Firestore
        const userDataResult = await getUserByUID({ uid: user.uid });

        if (userDataResult.ok && userDataResult.user) {
          const userData = userDataResult.user;

          dispatch(login({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            birthdate: userData.birthdate || null,
            nationality: userData.nationality || null,
            isMember: userData.isMember || false,
            profileCompleted: userData.profileCompleted || false
          }));

          dispatch(setRole({ role: userData.role || 'user' }));
        } else {
          // Si no se pudo obtener los datos de Firestore, usar los de Firebase Auth
          dispatch(login({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            profileCompleted: false
          }));

          dispatch(setRole({ role: 'user' }));
        }
      } catch (error) {
        console.error('Error en useCheckAuth:', error);
        dispatch(logout({ errorMessage: 'Error al verificar autenticación' }));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return {
    status
  };
};
