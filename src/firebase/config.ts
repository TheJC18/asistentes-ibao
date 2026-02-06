import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validar que las variables de entorno estén configuradas
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your_api_key_here') {
  console.error('❌ Firebase no configurado correctamente. Revisa el archivo .env');
  throw new Error('Firebase API Key no configurada. Por favor, configura el archivo .env con tus credenciales de Firebase.');
}

export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth: Auth = getAuth(firebaseApp);
export const FirebaseDB: Firestore = getFirestore(firebaseApp);

// App secundaria para crear usuarios sin cerrar sesión del admin
export const secondaryFirebaseApp: FirebaseApp = initializeApp(firebaseConfig, "Secondary");
export const SecondaryFirebaseAuth: Auth = getAuth(secondaryFirebaseApp);

/* Para usar Google Sign-In en producción, necesitas 
   añadir el dominio de tu app (Authentication/Configuracion/Dominios) */
