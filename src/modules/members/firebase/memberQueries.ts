import { 
  collection, 
  getDocs 
} from 'firebase/firestore';
import { FirebaseDB } from '@/firebase/config';
import { dateToISOString } from '@/core/helpers';
import { User } from '@/types';

// === INTERFACES ===

export interface GetAllMembersParams {
  filter?: 'all' | 'members' | 'non-members'; // Filtro por tipo de asistente
}

export interface GetAllMembersResult {
  ok: boolean;
  users?: User[];
  totalUsers?: number;
  errorMessage?: string;
}

// === OBTENER TODOS LOS USUARIOS (SIN PAGINACIÓN) ===
export const getAllMembers = async (params: GetAllMembersParams = {}): Promise<GetAllMembersResult> => {
  try {
    const { filter = 'all' } = params;

    // Referencia a la colección de usuarios
    const usersRef = collection(FirebaseDB, 'users');
    
    // Obtener todos los usuarios
    const querySnapshot = await getDocs(usersRef);
    
    // Mapear documentos a objetos
    let users = querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      const userData: User = {
        id: doc.id,
        // Convertir todos los campos de fecha a ISO strings para ser serializables en Redux
        createdAt: data.createdAt ? dateToISOString(data.createdAt) : '',
        updatedAt: data.updatedAt ? dateToISOString(data.updatedAt) : '',
        birthdate: data.birthdate ? dateToISOString(data.birthdate) : null,
        // Asegurar que todos los campos importantes estén incluidos
        profileCompleted: data.profileCompleted ?? false,
        role: data.role || 'user',
        name: data.name || data.displayName || '',
        email: data.email || '',
        nationality: data.nationality || '',
        isMember: data.isMember || false,
        avatar: data.avatar || data.photoURL || '/user_default.png',
        photoURL: data.photoURL || data.avatar || '/user_default.png',
        uid: data.uid || doc.id,
        gender: data.gender || '',
        status: data.status || 'active',
        hasWebAccess: data.hasWebAccess ?? true,
      };
      
      return userData;
    });
    
    // Ordenar por fecha de creación (más recientes primero)
    users.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Aplicar filtro según el tipo solicitado
    if (filter === 'members') {
      users = users.filter(user => user.isMember === true);
    } else if (filter === 'non-members') {
      users = users.filter(user => user.isMember === false);
    }
    // Si filter === 'all', devolver todos los usuarios sin filtrar
    
    return {
      ok: true,
      users,
      totalUsers: users.length
    };
    
  } catch (error: any) {
    console.error('Error al obtener todos los miembros de Firebase:', error);
    return {
      ok: false,
      errorMessage: `Error al cargar miembros: ${error.message}`
    };
  }
};
