import { 
  collection, 
  getDocs 
} from 'firebase/firestore';
import { FirebaseDB } from '@/firebase/config';
import { dateToISOString } from '@/core/helpers';
import { GetAllMembersParams, GetAllMembersResult } from '../types';
import type { User } from '@/types';
import { getFamilyByUserId } from '@/modules/family/firebase/familyQueries';

// === OBTENER TODOS LOS USUARIOS (SIN PAGINACIÓN) ===
export const getAllMembers = async (params: GetAllMembersParams = {}): Promise<GetAllMembersResult> => {
  try {
    const { filter = 'all' } = params;

    // Referencia a la colección de usuarios
    const usersRef = collection(FirebaseDB, 'users');
    
    // Obtener todos los usuarios
    const querySnapshot = await getDocs(usersRef);
    
    // Mapear documentos a objetos y obtener familia para cada usuario
    let users = await Promise.all(querySnapshot.docs.map(async doc => {
      const data = doc.data();
      const userData: User = {
        id: doc.id,
        createdAt: data.createdAt ? dateToISOString(data.createdAt) : '',
        updatedAt: data.updatedAt ? dateToISOString(data.updatedAt) : '',
        birthdate: data.birthdate ? dateToISOString(data.birthdate) : null,
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
      // Obtener familia (usando createdBy como referencia de titularidad)
      let family = await getFamilyByUserId(userData.id);
      // Invertir relación solo si el familiar es padre/madre y el usuario es hijo/hija, o viceversa
      if (Array.isArray(family)) {
        const { getInverseRelation } = await import('@/core/helpers/relations');
        family = family.map(fam => {
          // Si la relación es parent y el familiar es padre/madre, mostrar como parent
          // Si la relación es child y el familiar es hijo/hija, mostrar como child
          // Si la relación es parent pero el familiar es hijo/hija, invertir
          // Si la relación es child pero el familiar es padre/madre, invertir
          if (fam.relation === 'parent' && fam.id !== userData.id) {
            // El familiar es padre/madre del usuario
            return { ...fam, relation: 'parent' };
          }
          if (fam.relation === 'child' && fam.id !== userData.id) {
            // El familiar es hijo/hija del usuario
            return { ...fam, relation: 'child' };
          }
          // Si la relación es parent y el familiar es hijo/hija, invertir
          if (fam.relation === 'parent' && fam.id === userData.id) {
            return { ...fam, relation: getInverseRelation('parent', fam.gender) };
          }
          // Si la relación es child y el familiar es padre/madre, invertir
          if (fam.relation === 'child' && fam.id === userData.id) {
            return { ...fam, relation: getInverseRelation('child', fam.gender) };
          }
          // Para otras relaciones, mantener
          return fam;
        });
      }
      return { ...userData, family };
    }));
    
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