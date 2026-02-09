
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { useTranslation } from '@/core/context/LanguageContext';

// Helper para obtener traducciones fuera de componentes React
// NOTA: Esto es un workaround porque useTranslation es un hook de React y no puede usarse fuera de componentes.
// Si necesitas textos traducidos aquí, pásalos como argumento desde el componente llamador, o usa un objeto fallback claro.
// Por defecto, se usan textos en español si no se proveen traducciones.
let translations: any = null;
try {
  // Intenta obtener el objeto de traducciones actual (solo funcionará si hay contexto React)
  translations = require('@/core/context/LanguageContext').useTranslation();
} catch {
  // Si no es posible, se usará el fallback más abajo
}

// Inyectar CSS para z-index alto
const style = document.createElement('style');
style.textContent = `
  .swal-high-z-index {
    z-index: 10000 !important;
  }
`;
document.head.appendChild(style);

// Configuración base para todos los alerts
const getBaseConfig = () => {
  // Si no hay traducción disponible, fallback a español
  const fallback = {
    accept: 'Aceptar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    loading: 'Cargando...'
  };
  // Si hay traducciones, úsalas, si no, usa fallback
  const acceptText = translations?.common?.accept || fallback.accept;
  const cancelText = translations?.common?.cancel || fallback.cancel;
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

export const showSuccessAlert = (title: string, text?: string): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...getBaseConfig(),
    icon: 'success',
    title,
    text,
    timer: 3000,
    showConfirmButton: false
  });
};

export const showErrorAlert = (title: string, text?: string): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...getBaseConfig(),
    icon: 'error',
    title,
    text
  });
};

export const showWarningAlert = (title: string, text?: string): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...getBaseConfig(),
    icon: 'warning',
    title,
    text
  });
};

export const showInfoAlert = (title: string, text?: string): Promise<SweetAlertResult> => {
  return Swal.fire({
    ...getBaseConfig(),
    icon: 'info',
    title,
    text
  });
};

export const showConfirmAlert = (title: string, text: string, confirmButtonText?: string): Promise<SweetAlertResult> => {
  // Usa traducción si está disponible, si no, fallback
  const acceptText = translations?.common?.accept || 'Aceptar';
  const cancelText = translations?.common?.cancel || 'Cancelar';
  return Swal.fire({
    ...getBaseConfig(),
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmButtonText || acceptText,
    cancelButtonText: cancelText
  });
};

export const showDeleteConfirmAlert = (title?: string, text?: string): Promise<SweetAlertResult> => {
  // Usa traducción si está disponible, si no, fallback
  const deleteText = translations?.common?.delete || 'Eliminar';
  const cancelText = translations?.common?.cancel || 'Cancelar';
  const defaultTitle = translations?.messages?.deleteConfirmTitle || '¿Estás seguro?';
  const defaultText = translations?.messages?.deleteConfirmText || 'Esta acción no se puede deshacer';
  return Swal.fire({
    ...getBaseConfig(),
    icon: 'warning',
    title: title || defaultTitle,
    text: text || defaultText,
    showCancelButton: true,
    confirmButtonText: deleteText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#dc2626'
  });
};

export const showLoadingAlert = (title?: string, text?: string): void => {
  // Usa traducción si está disponible, si no, fallback
  const loadingText = translations?.common?.loading || 'Cargando...';
  Swal.fire({
    ...getBaseConfig(),
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
