import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

// Inyectar CSS para z-index alto
const style = document.createElement('style');
style.textContent = `
  .swal-high-z-index {
    z-index: 10000 !important;
  }
`;
document.head.appendChild(style);

// Configuración base para todos los alerts
const baseConfig: SweetAlertOptions = {
  confirmButtonColor: '#2563eb',
  cancelButtonColor: '#6b7280',
  confirmButtonText: 'Aceptar',
  cancelButtonText: 'Cancelar',
  customClass: {
    container: 'swal-high-z-index',
    popup: 'swal-high-z-index'
  }
};

export const showSuccessAlert = (title: string, text?: string): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...baseConfig,
    icon: 'success',
    title,
    text,
    timer: 3000,
    showConfirmButton: false
  });
};

export const showErrorAlert = (title: string, text?: string): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...baseConfig,
    icon: 'error',
    title,
    text
  });
};

export const showWarningAlert = (title: string, text?: string): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title,
    text
  });
};

export const showInfoAlert = (title: string, text?: string): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...baseConfig,
    icon: 'info',
    title,
    text
  });
};

export const showConfirmAlert = (title: string, text: string, confirmButtonText: string = 'Sí, continuar'): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...baseConfig,
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancelar'
  });
};

export const showDeleteConfirmAlert = (title: string = '¿Estás seguro?', text: string = 'Esta acción no se puede deshacer'): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc2626'
  });
};

export const showLoadingAlert = (title: string = 'Procesando...', text?: string): void => {
  Swal.fire({
    ...baseConfig,
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success'): void => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      container: 'swal-high-z-index',
      popup: 'swal-high-z-index'
    }
  });
};

export const closeAlert = (): void => {
  Swal.close();
};

export const showCustomAlert = (config: SweetAlertOptions): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...baseConfig,
    ...config
  });
};
