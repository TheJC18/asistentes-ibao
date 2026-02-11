// Tipos para breakpoints de columnas de tabla
export type TableColumnBreakpoint = 'base' | '2xs' | 'xs' | 'ss' | 'sm' | 'md' | 'lg' | 'xl';

// Utilidad para formatear fechas tipo dd/mm/yyyy
export function formatDateDMY(dateInput?: string | Date | null): string {
  if (!dateInput) return '-';
  let date: Date;
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return '-';
  }
  if (isNaN(date.getTime())) return '-';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy}`;
}
