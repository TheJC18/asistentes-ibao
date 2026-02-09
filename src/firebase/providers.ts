import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { FirebaseAuth } from './config';
import { checkOrCreateUser } from '@/modules/auth/firebase/authQueries';
import { FirebaseResponse } from '@/types';

const googleProvider = new GoogleAuthProvider();

interface SignInResult extends FirebaseResponse {
  uid?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

export const singInWithGoogle = async (): Promise<SignInResult> => {
  try {
    const result = await signInWithPopup(FirebaseAuth, googleProvider);
    const { displayName, email, photoURL, uid } = result.user;

    // Guardar en Firestore
    await checkOrCreateUser({
      uid,
      email: email || '',
      displayName: displayName || '',
      photoURL: photoURL || ''
    });

    return {
      ok: true,
      uid,
      email: email || '',
      displayName: displayName || '',
      photoURL: photoURL || ''
    };
  } catch (error: any) {
    const errorMessage = error.message || 'Error en Google Sign-In';
    return {
      ok: false,
      errorMessage
    };
  }
};

interface RegisterParams {
  email: string;
  password: string;
  displayName: string;
}

export const registerUserWithEmailPassword = async ({
  email,
  password,
  displayName
}: RegisterParams): Promise<SignInResult> => {
  try {
    const resp = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
    const { uid, photoURL } = resp.user;

    await updateProfile(FirebaseAuth.currentUser!, { displayName });

    return {
      ok: true,
      uid,
      email,
      displayName,
      photoURL: photoURL || ''
    };
  } catch (error: any) {
    const errorMessage = error.message || 'auth.errorCreatingUser';
    return {
      ok: false,
      errorMessage
    };
  }
};

interface LoginParams {
  email: string;
  password: string;
}

export const loginWithEmailPassword = async ({
  email,
  password
}: LoginParams): Promise<SignInResult> => {
  try {
    const resp = await signInWithEmailAndPassword(FirebaseAuth, email, password);
    const { uid, photoURL, displayName } = resp.user;

    return {
      ok: true,
      uid,
      photoURL: photoURL || '',
      displayName: displayName || email,
      email
    };
  } catch (error: any) {
    const errorCode = error.code;
    let errorMessage = 'auth.errorLogin';

    if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
      errorMessage = 'auth.invalidCredentials';
    } else if (errorCode === 'auth/too-many-requests') {
      errorMessage = 'auth.tooManyRequests';
    } else if (errorCode === 'auth/user-disabled') {
      errorMessage = 'auth.userDisabled';
    } else if (errorCode === 'auth/invalid-credential') {
      errorMessage = 'auth.invalidCredential';
    }

    return {
      ok: false,
      errorMessage,
      errorCode
    };
  }
};

export const logoutFirebase = async (): Promise<void> => {
  return await signOut(FirebaseAuth);
};
