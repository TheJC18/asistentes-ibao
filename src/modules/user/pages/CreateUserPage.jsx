import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../hooks/useUserStore';
import { useForm } from '../../../hooks/useForm';
import { InputField } from '../../../components/form/input/InputField';
import { Select } from '../../../components/form/Select';
import { Button } from '../../../components/ui/button';

const initialFormData = {
    displayName: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    department: '',
    status: 'active'
};

export const CreateUserPage = () => {
    const navigate = useNavigate();
    const { createUser, isCreating } = useUserStore();
    const [errors, setErrors] = useState({});

    const { 
        formState, 
        onInputChange, 
        onResetForm 
    } = useForm(initialFormData);

    const {
        displayName,
        email,
        password,
        role,
        phone,
        department,
        status
    } = formState;

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

        if (!password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        const result = await createUser({
            displayName: displayName.trim(),
            email: email.trim().toLowerCase(),
            password,
            role,
            phone: phone.trim(),
            department: department.trim(),
            status,
            createdAt: new Date().toISOString()
        });

        if (result.ok) {
            alert('Usuario creado exitosamente');
            navigate('/users');
        } else {
            alert('Error al crear usuario: ' + result.errorMessage);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Crear Nuevo Usuario
                </h1>
                <p className="text-gray-600">
                    Completa la información para crear un nuevo usuario en el sistema
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

                        <div>
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
                        </div>

                        <div>
                            <InputField
                                label="Contraseña"
                                name="password"
                                type="password"
                                value={password}
                                onChange={onInputChange}
                                placeholder="Mínimo 6 caracteres"
                                error={errors.password}
                                required
                            />
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

                    {/* Botones */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/users')}
                            disabled={isCreating}
                        >
                            Cancelar
                        </Button>
                        
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onResetForm}
                            disabled={isCreating}
                        >
                            Limpiar
                        </Button>
                        
                        <Button
                            type="submit"
                            disabled={isCreating}
                        >
                            {isCreating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creando...
                                </>
                            ) : (
                                'Crear Usuario'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
