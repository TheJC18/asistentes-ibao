import { AppDispatch } from '@/core/store';
import { loginWithEmailPassword, logoutFirebase, registerUserWithEmailPassword, singInWithGoogle } from '@/firebase/providers';
import { ROLES } from '@/core/helpers/roles';
import { getRole, getProfileCompleted, updateProfileCompleted, checkOrCreateUser, getUserByUID, updateUserPhotoURL } from '@/modules/auth/firebase/authQueries';
import { LoginParams, GetRoleParams, UpdateProfileCompletedParams, GetProfileCompletedParams, CheckOrCreateUserParams } from '@/modules/auth/types';
import { chekingCredentials, login, logout, setProfileCompleted, setRole } from '@/modules/auth/store';

export const checkingAuthentication = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(chekingCredentials());
    };
};

export const startGoogleSignIn = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(chekingCredentials());
        const result = await singInWithGoogle();

        if (!result.ok) {
            dispatch(logout({ errorMessage: result.errorMessage }));
            return;
        }

        // Asegurar que el usuario exista en Firestore
        await checkOrCreateUser({
            uid: result.uid!,
            displayName: result.displayName!,
            photoURL: result.photoURL,
            email: result.email!
        });

        // Obtener TODOS los datos del usuario desde Firestore
        const userDataResult = await getUserByUID({ uid: result.uid! });

        if (userDataResult.ok && userDataResult.user) {
            const userData = userDataResult.user;

            // Si la foto de Google es diferente a la guardada, actualiza en Firestore
            if (result.photoURL && userData.photoURL !== result.photoURL) {
                await updateUserPhotoURL(result.uid!, result.photoURL);
            }

            dispatch(login({
                uid: result.uid!,
                email: userData.email || result.email!,
                name: userData.name || userData.displayName || result.displayName!,
                displayName: userData.displayName || result.displayName!,
                avatar: userData.avatar || userData.photoURL || result.photoURL,
                photoURL: userData.photoURL || result.photoURL,
                birthdate: userData.birthdate || null,
                nationality: userData.nationality || null,
                isMember: userData.isMember || false,
                profileCompleted: userData.profileCompleted || false,
                phone: userData.phone || null,
                gender: userData.gender || null,
                relation: userData.relation || null,
                hasWebAccess: userData.hasWebAccess ?? null
            }));

            dispatch(setRole({ role: userData.role || ROLES.USER }));
        } else {
            // Si no se pudo obtener los datos de Firestore, usar los datos básicos
            dispatch(login({
                uid: result.uid!,
                email: result.email!,
                name: result.displayName!,
                displayName: result.displayName!,
                avatar: result.photoURL,
                photoURL: result.photoURL
            }));
            dispatch(setRole({ role: ROLES.USER }));
            dispatch(setProfileCompleted({ profileCompleted: false }));
        }
    };
};

export const startCreatingUserWithEmailPassword = ({ displayName, email, password }: LoginParams & { displayName: string }) => {
    return async (dispatch: AppDispatch) => {
        dispatch(chekingCredentials());

        const { ok, uid, photoURL, errorMessage } = await registerUserWithEmailPassword({ displayName, email, password });
        
        if (!ok) {
            dispatch(logout({ errorMessage }));
            return;
        }

        await checkOrCreateUser({
            uid: uid!,
            displayName,
            photoURL,
            email
        });

        const userDataResult = await getUserByUID({ uid: uid! });

        if (userDataResult.ok && userDataResult.user) {
            const userData = userDataResult.user;

            dispatch(login({
                uid: uid!,
                email: userData.email || email,
                name: userData.name || userData.displayName || displayName,
                displayName: userData.displayName || displayName,
                avatar: userData.avatar || userData.photoURL || photoURL,
                photoURL: userData.photoURL || photoURL,
                birthdate: userData.birthdate || null,
                nationality: userData.nationality || null,
                isMember: userData.isMember || false,
                profileCompleted: userData.profileCompleted || false,
                phone: userData.phone || null,
                gender: userData.gender || null,
                relation: userData.relation || null,
                hasWebAccess: userData.hasWebAccess ?? null
            }));

            dispatch(setRole({ role: userData.role || ROLES.USER }));
        } else {
            dispatch(login({
                uid: uid!,
                email,
                name: displayName,
                displayName,
                avatar: photoURL,
                photoURL
            }));
            dispatch(setRole({ role: ROLES.USER }));
            dispatch(setProfileCompleted({ profileCompleted: false }));
        }
    };
};

export const startLoginWithEmailPassword = ({ email, password }: LoginParams) => {
    return async (dispatch: AppDispatch) => {
        dispatch(chekingCredentials());

        const { ok, uid, displayName, photoURL, errorMessage } = await loginWithEmailPassword({ email, password });
        
        if (!ok) {
            dispatch(logout({ errorMessage }));
            return;
        }

        // Asegurar que el usuario exista en Firestore
        await checkOrCreateUser({
            uid: uid!,
            displayName: displayName!,
            photoURL,
            email
        });

        // Obtener TODOS los datos del usuario desde Firestore (igual que en useCheckAuth)
        const userDataResult = await getUserByUID({ uid: uid! });

        if (userDataResult.ok && userDataResult.user) {
            const userData = userDataResult.user;

            dispatch(login({
                uid: uid!,
                email: userData.email || email,
                name: userData.name || userData.displayName || displayName!,
                displayName: userData.displayName || displayName!,
                avatar: userData.avatar || userData.photoURL || photoURL,
                photoURL: userData.photoURL || photoURL,
                birthdate: userData.birthdate || null,
                nationality: userData.nationality || null,
                isMember: userData.isMember || false,
                profileCompleted: userData.profileCompleted || false,
                phone: userData.phone || null,
                gender: userData.gender || null,
                relation: userData.relation || null,
                hasWebAccess: userData.hasWebAccess ?? null
            }));

            dispatch(setRole({ role: userData.role || ROLES.USER }));
        } else {
            // Si no se pudo obtener los datos de Firestore, usar los datos básicos
            dispatch(login({
                uid: uid!,
                email: email,
                name: displayName!,
                displayName: displayName!,
                avatar: photoURL,
                photoURL: photoURL
            }));

            dispatch(setRole({ role: ROLES.USER }));
            dispatch(setProfileCompleted({ profileCompleted: false }));
        }
    };
};

export const startLogOut = () => {
    return async (dispatch: AppDispatch) => {
        await logoutFirebase();
        dispatch(logout(undefined));
    };
};

export const startGetRole = ({ uid }: GetRoleParams) => {
    return async (dispatch: AppDispatch) => {
        try {
            const { ok, role } = await getRole({ uid });
            if (!ok) {
                dispatch(setRole({ role: ROLES.USER }));
            } else {
                dispatch(setRole({ role: role || ROLES.USER }));
            }
        } catch {
            dispatch(setRole({ role: ROLES.USER }));
        }
    };
};

export const startGetProfileCompleted = ({ uid }: GetProfileCompletedParams) => {
    return async (dispatch: AppDispatch) => {
        try {
            const { ok, profileCompleted } = await getProfileCompleted({ uid });
            if (ok) {
                dispatch(setProfileCompleted({ profileCompleted: profileCompleted || false }));
            } else {
                dispatch(setProfileCompleted({ profileCompleted: false }));
            }
        } catch {
            dispatch(setProfileCompleted({ profileCompleted: false }));
        }
    };
};

export const startUpdateProfileCompleted = ({ uid, profileCompleted = true }: UpdateProfileCompletedParams) => {
    return async (dispatch: AppDispatch) => {
        try {
            const result = await updateProfileCompleted({ uid, profileCompleted });
            if (result.ok) {
                dispatch(setProfileCompleted({ profileCompleted }));
                return { ok: true };
            }
            return { ok: false, error: result.error };
        } catch (error: any) {
            return { ok: false, error: error.message };
        }
    };
};