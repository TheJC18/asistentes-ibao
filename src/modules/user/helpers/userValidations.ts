/**
 * Validaciones para formularios de usuario
 */

interface ValidateUserFormParams {
  formData: any;
  password: string;
  confirmPassword: string;
  mode: 'create' | 'edit' | 'view' | 'family';
  hasWebAccess?: boolean;
}

/**
 * Valida los datos del formulario de usuario
 */
export const validateUserForm = ({ 
  formData, 
  password, 
  confirmPassword, 
  mode, 
  hasWebAccess = false 
}: ValidateUserFormParams): string[] => {
  const errors: string[] = [];
  const isCreate = mode === 'create';
  const isEdit = mode === 'edit';
  const isFamily = mode === 'family';

  // Validar nombre (obligatorio siempre)
  if (!formData.name || formData.name.trim() === '') {
    errors.push('• El nombre es obligatorio');
  }

  // Validar relación en modo family
  if (isFamily && (!formData.relation || formData.relation.trim() === '')) {
    errors.push('• La relación es obligatoria');
  }

  // Validar fecha de nacimiento (obligatorio siempre)
  if (!formData.birthdate || formData.birthdate.trim() === '') {
    errors.push('• La fecha de nacimiento es obligatoria');
  }

  // Validar nacionalidad (obligatorio siempre)
  if (!formData.nationality || formData.nationality.trim() === '') {
    errors.push('• La nacionalidad es obligatoria');
  }

  // Validar email (obligatorio en create, o en family con acceso web)
  if (isCreate && (!formData.email || formData.email.trim() === '')) {
    errors.push('• El correo electrónico es obligatorio');
  }

  if (isFamily && hasWebAccess && (!formData.email || formData.email.trim() === '')) {
    errors.push('• El correo electrónico es obligatorio para dar acceso a la web');
  }

  // Validar contraseñas en modo creación
  if (isCreate) {
    const passwordErrors = validatePassword(password, confirmPassword, true);
    errors.push(...passwordErrors);
  }

  // Validar contraseñas en modo family solo si tiene acceso web
  if (isFamily && hasWebAccess) {
    const passwordErrors = validatePassword(password, confirmPassword, true);
    errors.push(...passwordErrors.map(err => 
      err === '• La contraseña es obligatoria' 
        ? '• La contraseña es obligatoria para dar acceso a la web' 
        : err
    ));
  }

  // Validar contraseñas en modo edición solo si se proporcionó contraseña
  if (isEdit && password) {
    const passwordErrors = validatePassword(password, confirmPassword, false);
    errors.push(...passwordErrors);
  }

  return errors;
};

/**
 * Valida contraseña y confirmación
 */
const validatePassword = (password: string, confirmPassword: string, required: boolean = true): string[] => {
  const errors: string[] = [];

  if (required && (!password || password.trim() === '')) {
    errors.push('• La contraseña es obligatoria');
    return errors;
  }

  if (password && password.length < 6) {
    errors.push('• La contraseña debe tener al menos 6 caracteres');
  }

  if (password && password !== confirmPassword) {
    errors.push('• Las contraseñas no coinciden');
  }

  return errors;
};
/**
 * Prepara los datos del formulario para guardar
 */
export interface PrepareUserDataParams {
    formData: any;
    password: string;
    mode: string;
    hasWebAccess?: boolean;
}

export const prepareUserDataForSave = ({ 
    formData, 
    password, 
    mode, 
    hasWebAccess = false 
}: PrepareUserDataParams): any => {
    const isCreate = mode === 'create';
    const isEdit = mode === 'edit';
    const isFamily = mode === 'family';

    // Sincronizar name y displayName
    const syncedData = {
        ...formData,
        name: formData.name || formData.displayName || '',
        displayName: formData.displayName || formData.name || '',
    };

    let dataToSave = { ...syncedData };

    // Incluir contraseña si aplica (solo cuando hay acceso web)
    if (isCreate || (isEdit && password) || (isFamily && hasWebAccess && password)) {
        dataToSave.password = password;
    }

    // Agregar hasWebAccess
    if (isFamily) {
        dataToSave.hasWebAccess = hasWebAccess;
    } else if (isCreate) {
        dataToSave.hasWebAccess = true; // Usuario normal siempre tiene acceso web
    }

    return dataToSave;
};