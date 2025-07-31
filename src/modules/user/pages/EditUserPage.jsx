import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../hooks/useUserStore';
import { useForm } from '../../../hooks/useForm';
import { InputField } from '../../../components/form/input/InputField';
import { Select } from '../../../components/form/Select';
import { Button } from '../../../components/ui/button';

export const EditUserPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { 
        currentUser, 
        isUserLoading, 
        userError,
        isUpdating,
        loadUserById, 
        updateUser,
        clearUser 
    } = useUserStore();
    
    const [errors, setErrors] = useState({});
    const [isFormReady, setIsFormReady] = useState(false);

    const { 
        formState, 
        onInputChange, 
        setFormState 
    } = useForm({
        displayName: '',
        email: '',
        role: 'user',
        phone: '',
        department: '',
        status: 'active'
    });

    const {
        displayName,
        email,
        role,
        phone,
        department,
        status
    } = formState;

    // Cargar usuario al montar el componente
    useEffect(() => {
        if (userId) {
            loadUserById(userId);
        }
        
        return () => {
            clearUser();
        };
    }, [userId]);

    // Llenar formulario cuando se carga el usuario
    useEffect(() => {
        if (currentUser && !isFormReady) {
            setFormState({
                displayName: currentUser.displayName || '',
                email: currentUser.email || '',
                role: currentUser.role || 'user',
                phone: currentUser.phone || '',
                department: currentUser.department || '',
                status: currentUser.status || 'active'
            });
            setIsFormReady(true);
        }
    }, [currentUser, isFormReady]);

    // Validación del formulario
    const validateForm = () => {
        const newErrors = {};

        if (!displayName.trim()) {
            newErrors.displayName = 'El nombre es requerido';
        }

        if (!email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'El email no es válido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        const updatedData = {
            displayName: displayName.trim(),
            email: email.trim().toLowerCase(),
            role,
            phone: phone.trim(),
            department: department.trim(),
            status,
            updatedAt: new Date().toISOString()
        };

        const result = await updateUser(userId, updatedData);

        if (result.ok) {
            alert('Usuario actualizado exitosamente');
            navigate('/users');
        } else {
            alert('Error al actualizar usuario: ' + result.errorMessage);
        }
    };

    // Estados de carga
    if (isUserLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Cargando usuario...</span>
            </div>
        );
    }

    if (userError) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>Error:</strong> {userError}
                    <div className="mt-4 space-x-2">
                        <Button 
                            onClick={() => loadUserById(userId)} 
                            variant="outline"
                            size="sm"
                        >
                            Reintentar
                        </Button>
                        <Button 
                            onClick={() => navigate('/users')} 
                            variant="outline"
                            size="sm"
                        >
                            Volver a la lista
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">Usuario no encontrado</div>
                    <Button 
                        onClick={() => navigate('/users')} 
                        className="mt-4"
                    >
                        Volver a la lista
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Editar Usuario
                </h1>
                <p className="text-gray-600">
                    Modifica la información del usuario: {currentUser.displayName}
                </p>
            </div>

            {/* Formulario */}
            <div className="bg-white shadow rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <InputField
                                label="Nombre completo"
                                name="displayName"
                                value={displayName}
                                onChange={onInputChange}
                                placeholder="Ej: Juan Pérez"
                                error={errors.displayName}
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={onInputChange}
                                placeholder="ejemplo@correo.com"
                                error={errors.email}
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Cambiar el email puede afectar el inicio de sesión del usuario
                            </p>
                        </div>

                        <div>
                            <InputField
                                label="Teléfono"
                                name="phone"
                                value={phone}
                                onChange={onInputChange}
                                placeholder="Ej: +1234567890"
                            />
                        </div>

                        <div>
                            <InputField
                                label="Departamento"
                                name="department"
                                value={department}
                                onChange={onInputChange}
                                placeholder="Ej: Tecnología"
                            />
                        </div>
                    </div>

                    {/* Configuración */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rol
                            </label>
                            <Select
                                name="role"
                                value={role}
                                onChange={onInputChange}
                                options={[
                                    { value: 'user', label: 'Usuario' },
                                    { value: 'moderator', label: 'Moderador' },
                                    { value: 'admin', label: 'Administrador' }
                                ]}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estado
                            </label>
                            <Select
                                name="status"
                                value={status}
                                onChange={onInputChange}
                                options={[
                                    { value: 'active', label: 'Activo' },
                                    { value: 'inactive', label: 'Inactivo' }
                                ]}
                            />
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="pt-6 border-t border-gray-200">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Información del sistema</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>ID:</strong> {currentUser.id}</p>
                                <p><strong>Creado:</strong> {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'No disponible'}</p>
                                <p><strong>Última actualización:</strong> {currentUser.updatedAt ? new Date(currentUser.updatedAt).toLocaleDateString() : 'No disponible'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/users')}
                            disabled={isUpdating}
                        >
                            Cancelar
                        </Button>
                        
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(`/users/${userId}`)}
                            disabled={isUpdating}
                        >
                            Ver Perfil
                        </Button>
                        
                        <Button
                            type="submit"
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
