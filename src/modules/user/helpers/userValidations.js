/**
 * Validaciones para formularios de usuario
 */

/**
 * Valida los datos del formulario de usuario
 * @param {Object} params - Parámetros de validación
 * @param {Object} params.formData - Datos del formulario
 * @param {string} params.password - Contraseña
 * @param {string} params.confirmPassword - Confirmación de contraseña
 * @param {string} params.mode - Modo del formulario (create, edit, view, family)
 * @param {boolean} params.hasWebAccess - Si el familiar tiene acceso web
 * @returns {string[]} - Array de mensajes de error (vacío si no hay errores)
 */
export const validateUserForm = ({ formData, password, confirmPassword, mode, hasWebAccess = false }) => {
    const errors = [];
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

    // Validar contraseñas en modo creación (solo si es create normal, no family sin acceso)
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
 * @param {string} password - Contraseña
 * @param {string} confirmPassword - Confirmación de contraseña
 * @param {boolean} required - Si la contraseña es obligatoria
 * @returns {string[]} - Array de mensajes de error
 */
const validatePassword = (password, confirmPassword, required = true) => {
    const errors = [];

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
 * @param {Object} params - Parámetros
 * @param {Object} params.formData - Datos del formulario
 * @param {string} params.password - Contraseña
 * @param {string} params.mode - Modo del formulario
 * @param {boolean} params.hasWebAccess - Si el familiar tiene acceso web
 * @returns {Object} - Datos preparados para guardar
 */
export const prepareUserDataForSave = ({ formData, password, mode, hasWebAccess = false }) => {
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
