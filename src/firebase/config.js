import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Cambiado de 'lite' a la versión completa

const firebaseConfig = {
  apiKey: "AIzaSyChm3E-vxnQXx0LkjscusAzVj6rLLcnDVU",
  authDomain: "miembros-y-asistentes.firebaseapp.com",
  projectId: "miembros-y-asistentes",
  storageBucket: "miembros-y-asistentes.firebasestorage.app",
  messagingSenderId: "823730902350",
  appId: "1:823730902350:web:b80f6c8f14a12cf6a37a1f"
};

// Initialize Firebase
export const FirebaseApp  = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth( FirebaseApp );
export const FirebaseDB   = getFirestore( FirebaseApp );

// Segunda instancia de Firebase Auth para crear usuarios sin afectar la sesión principal
export const SecondaryFirebaseApp = initializeApp(firebaseConfig, "Secondary");
export const SecondaryFirebaseAuth = getAuth(SecondaryFirebaseApp);

/* Para que el login funcione en el navegador en prod tienes que:
   añadir el dominio de tu app (Authentication/Configuracion/Dominios) */