import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge from '../../../components/ui/badge/Badge';
import FloatingAddButton from '../../../components/ui/FloatingAddButton';
import UserModal from '../components/UserModal';
import { useUserModal } from '../hooks/useUserModal';
import { useUserStore } from '../hooks/useUserStore';
import EntityList from '../../../components/ui/table/EntityList';
import { getCountryNameByCode } from '../helpers/userUtils';
import { formatDate } from '../../../helpers/dateUtils';

export default function UserListPage() {
  // Hook del store de usuarios
  const {
    users,
    isLoading,
    error,
    isDeleting,
    loadUsers,
    deleteUser,
    refreshUsers
  } = useUserStore();

  // Hook para el modal (mantenemos la funcionalidad existente)
  const {
    open,
    mode,
    user,
    handleOpen,
    handleClose,
  } = useUserModal();

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const columns = [
    {
      key: 'avatar',
      label: 'Avatar',
      className: 'text-start',
      visibleOn: ["xs", "ss", "sm", "md", "lg", "xl"], // Visible desde xs en adelante
      render: (userItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-blue-400 shadow">
            <img 
              width={40} 
              height={40} 
              src={userItem.photoURL || userItem.avatar || '/user_default.png'} 
              alt={userItem.displayName || userItem.name} 
            />
          </div>
        </div>
      ),
    },
    {
      key: 'displayName',
      label: 'Nombre',
      className: 'text-start font-semibold text-base md:text-lg',
      visibleOn: ["base", "2xs", "xs", "ss", "sm", "md", "lg", "xl"], // Siempre visible
      render: (userItem) => userItem.displayName || userItem.name || 'Sin nombre',
    },
    {
      key: 'role',
      label: 'Rol',
      className: 'text-start',
      visibleOn: ["md", "lg", "xl"], // Visible desde ss en adelante
      render: (userItem) => (
        <Badge size="sm" color={userItem.role === 'admin' ? 'primary' : 'warning'}>
          {userItem.role === 'admin' ? 'ADMIN' : 'USUARIO'}
        </Badge>
      ),
    },
    {
      key: 'isMember',
      label: '¿Es miembro?',
      className: 'text-start',
      visibleOn: ["sm", "md", "lg", "xl"], // Visible desde sm en adelante
      render: (userItem) => (
        <Badge size="xl" color={userItem.isMember === true ? 'success' : 'error'}   variant = "solid">
          {userItem.isMember === true ? <FontAwesomeIcon icon={["fas", "check"]} /> : <FontAwesomeIcon icon={["fas", "times"]} />}
        </Badge>
      ),
    },
    { 
      key: 'nationality', 
      label: 'Ubicación',  
      className: 'text-start', 
      visibleOn: ["md", "lg", "xl"],
      render: (userItem) => {
        const nationality = userItem.nationality;
        if (!nationality) return '-';
        
        // Si tiene 2 caracteres, asumimos que es un código
        if (nationality.length === 2) {
          const countryName = getCountryNameByCode(nationality);
          return countryName || nationality || '-';
        }
        
        // Si es más largo, asumimos que ya es el nombre del país
        return nationality || '-';
      }
    },
    { 
      key: 'email', 
      label: 'Correo', 
      className: 'text-start', 
      visibleOn: ["lg", "xl"],
      render: (userItem) => userItem.email || '-'
    },
    { 
      key: 'birthdate', 
      label: 'Nacimiento', 
      className: 'text-start', 
      visibleOn: ["lg", "xl"],
      render: (userItem) => formatDate(userItem.birthdate) || '-'
    },
  ];

  const filterFunction = (u, search) => {
    const name = u.displayName || u.name || '';
    const email = u.email || '';
    return name.toLowerCase().includes(search.toLowerCase()) ||
           email.toLowerCase().includes(search.toLowerCase());
  };

  const renderActions = (userItem) => (
    <div className="flex flex-row gap-1 items-center justify-center">
      <button 
        className="p-1 h-7 w-7 text-xs rounded-full bg-blue-500/80 hover:bg-blue-700 text-white transition" 
        title="Ver detalles" 
        onClick={() => handleOpen('view', userItem)}
        disabled={isDeleting}
      >
        <FontAwesomeIcon icon={["fas", "eye"]} />
      </button>
      <button 
        className="p-1 h-7 w-7 text-xs rounded-full bg-green-500/80 hover:bg-green-700 text-white transition" 
        title="Editar usuario" 
        onClick={() => handleOpen('edit', userItem)}
        disabled={isDeleting}
      >
        <FontAwesomeIcon icon={["fas", "edit"]} />
      </button>
      <button 
        className={`p-1 h-7 w-7 text-xs rounded-full transition ${
          isDeleting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-red-500/80 hover:bg-red-700'
        } text-white`}
        title="Eliminar usuario" 
        onClick={() => handleDelete(userItem)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <FontAwesomeIcon icon={["fas", "spinner"]} className="animate-spin" />
        ) : (
          <FontAwesomeIcon icon={["fas", "trash"]} />
        )}
      </button>
    </div>
  );

  // Función para eliminar usuario
  const handleDelete = async (userItem) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario "${userItem.name}"?`)) {
      try {
        const result = await deleteUser(userItem.id);
        if (result.ok) {
          // Mostrar mensaje de éxito (opcional)
          console.log('Usuario eliminado exitosamente');
        } else {
          alert('Error al eliminar usuario: ' + result.errorMessage);
        }
      } catch (error) {
        alert('Error inesperado al eliminar usuario');
        console.error('Error:', error);
      }
    }
  };

  // Función para guardar usuario
  const handleSave = async (data) => {
    try {
      // Aquí puedes agregar lógica para crear/actualizar según el mode
      console.log('Datos a guardar:', data);
      console.log('Modo:', mode);
      
      // Refrescar la lista después de guardar
      await refreshUsers();
      
      handleClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando usuarios...</span>
      </div>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <div className="flex items-center justify-between">
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button 
            onClick={() => loadUsers()} 
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <EntityList
      title={(
        <>
          <FontAwesomeIcon icon={["fas", "address-book"]} className="text-blue-700 px-3" />
          Listado de usuarios
        </>
      )}
      data={users}
      columns={columns}
      renderActions={renderActions}
      filterFunction={filterFunction}
      FloatingButton={
        <FloatingAddButton
          title="Agregar usuario"
          onClick={() => handleOpen('create', { 
            name: '',
            displayName: '', 
            email: '', 
            role: 'user', 
            nationality: '',
            birthdate: '',
            avatar: '',
            photoURL: '',
            isMember: false
          })}
          disabled={isLoading || isDeleting}
        />
      }
      ModalComponent={
        <UserModal 
          open={open} 
          onClose={handleClose} 
          mode={mode} 
          user={user} 
          onSave={handleSave} 
        />
      }
    />
  );
}