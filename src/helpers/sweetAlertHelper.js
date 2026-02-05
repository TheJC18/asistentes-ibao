import Swal from 'sweetalert2';

// Configuración base para todos los alerts
const baseConfig = {
  confirmButtonColor: '#2563eb',
  cancelButtonColor: '#6b7280',
  confirmButtonText: 'Aceptar',
  cancelButtonText: 'Cancelar',
};

// Alert de éxito
export const showSuccessAlert = (title, text) => {
  return Swal.fire({
    ...baseConfig,
    icon: 'success',
    title,
    text,
    timer: 5000,
    timerProgressBar: true,
  });
};

// Alert de error
export const showErrorAlert = (title, text) => {
  return Swal.fire({
    ...baseConfig,
    icon: 'error',
    title,
    text,
  });
};

// Alert de advertencia
export const showWarningAlert = (title, text) => {
  return Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title,
    text,
  });
};

// Alert de información
export const showInfoAlert = (title, text) => {
  return Swal.fire({
    ...baseConfig,
    icon: 'info',
    title,
    text,
  });
};

// Alert de confirmación con Yes/No
export const showConfirmAlert = (title, text, confirmButtonText = 'Sí, continuar') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    reverseButtons: true,
  });
};

// Alert de confirmación para eliminar
export const showDeleteConfirmAlert = (itemName = 'este elemento') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar ${itemName}? Esta acción no se puede deshacer.`,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    confirmButtonColor: '#dc2626',
    reverseButtons: true,
  });
};

// Toast notification (pequeña notificación en la esquina)
export const showToast = (icon, title) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  return Toast.fire({
    icon,
    title,
  });
};

// Alert personalizado con HTML
export const showCustomAlert = (config) => {
  return Swal.fire({
    ...baseConfig,
    ...config,
  });
};

// Alert de carga (loading)
export const showLoadingAlert = (title = 'Procesando...', text = 'Por favor espera') => {
  Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Cerrar cualquier alert abierto
export const closeAlert = () => {
  Swal.close();
};
