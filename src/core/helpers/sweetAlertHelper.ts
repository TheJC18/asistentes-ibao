import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

// Inyectar CSS para z-index alto y solo margin-top en toast
const style = document.createElement('style');
style.textContent = `
  .swal-high-z-index {
    z-index: 10000 !important;
  }
  .swal-toast-below-header {
    margin-top: 6% !important;
  }
  @media (max-width: 600px) {
    .swal-toast-below-header {
      margin-top: 10% !important;
    }
  }
  @media (min-width: 601px) and (max-width: 900px) {
    .swal-toast-below-header {
      margin-top: 7% !important;
    }
  }
  @media (min-width: 901px) and (max-width: 1200px) {
    .swal-toast-below-header {
      margin-top: 6% !important;
    }
  }
  @media (min-width: 1201px) {
    .swal-toast-below-header {
      margin-top: 6% !important;
    }
  }
`;
document.head.appendChild(style);

// Configuración base para todos los alerts
const getBaseConfig = (translate?: any) => {
  // Si no hay traducción disponible, fallback a español
  const fallback = {
    accept: 'Aceptar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    loading: 'Cargando...'
  };
  // Si hay traducciones, úsalas, si no, usa fallback
  const acceptText = translate?.common?.accept || fallback.accept;
  const cancelText = translate?.common?.cancel || fallback.cancel;
  return {
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    confirmButtonText: acceptText,
    cancelButtonText: cancelText,
    customClass: {
      container: 'swal-high-z-index',
      popup: 'swal-high-z-index'
    }
  };
};

export const showSuccessAlert = (title: string, text?: string, translate?: any): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...getBaseConfig(translate),
    icon: 'success',
    title,
    text,
    timer: 3000,
    showConfirmButton: false
  });
};

export const showErrorAlert = (title: string, text?: string, translate?: any): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...getBaseConfig(translate),
    icon: 'error',
    title,
    text
  });
};

export const showWarningAlert = (title: string, text?: string, translate?: any): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...getBaseConfig(translate),
    icon: 'warning',
    title,
    text
  });
};

export const showInfoAlert = (title: string, text?: string, translate?: any): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...getBaseConfig(translate),
    icon: 'info',
    title,
    text
  });
};

export const showConfirmAlert = (title: string, text: string, translate?: any, confirmButtonText?: string): Promise<SweetAlertResult> => {
  // Usa traducción si está disponible, si no, fallback
  const acceptText = translate?.common?.accept || 'Aceptar';
  const cancelText = translate?.common?.cancel || 'Cancelar';
  return Swal.fire({
    ...getBaseConfig(translate),
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmButtonText || acceptText,
    cancelButtonText: cancelText
  });
};

export const showDeleteConfirmAlert = (title?: string, text?: string, translate?: any): Promise<SweetAlertResult> => {
  // Usa traducción si está disponible, si no, fallback
  const deleteText = translate?.common?.delete || 'Eliminar';
  const cancelText = translate?.common?.cancel || 'Cancelar';
  const defaultTitle = translate?.messages?.deleteConfirmTitle || '¿Estás seguro?';
  const defaultText = translate?.messages?.deleteConfirmText || 'Esta acción no se puede deshacer';
  return Swal.fire({
    ...getBaseConfig(translate),
    icon: 'warning',
    title: title || defaultTitle,
    text: text || defaultText,
    showCancelButton: true,
    confirmButtonText: deleteText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#dc2626'
  });
};

export const showLoadingAlert = (title?: string, text?: string, translate?: any): void => {
  // Usa traducción si está disponible, si no, fallback
  const loadingText = translate?.common?.loading || 'Cargando...';
  Swal.fire({
    ...getBaseConfig(translate),
    title: title || loadingText,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export const closeAlert = (): void => {
  Swal.close();
};

export const showToast = (icon: 'success' | 'error' | 'warning' | 'info' = 'info', title: string = ''): void => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      container: 'swal-high-z-index swal-toast-below-header',
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  Toast.fire({
    icon,
    title
  });
};
