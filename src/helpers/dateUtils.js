/**
 * Utilidades para el manejo y formateo de fechas
 */

/**
 * Formatea una fecha al formato d-m-Y (día-mes-año)
 * @param {Date|Timestamp|string|null|undefined} date - La fecha a formatear
 * @returns {string} - Fecha formateada como "dd-mm-yyyy" o cadena vacía si no hay fecha
 */
export const formatDate = (date) => {
    if (!date) return '';
    
    let d = date;
    
    // Si es un Timestamp de Firestore, convertir a Date
    if (typeof date.toDate === 'function') {
        d = date.toDate();
    }
    
    // Si no es una instancia de Date, crear una nueva
    if (!(d instanceof Date)) {
        d = new Date(d);
    }
    
    // Verificar que la fecha sea válida
    if (isNaN(d.getTime())) {
        return '';
    }
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}-${month}-${year}`;
};

/**
 * Convierte una fecha al formato ISO string para almacenamiento
 * @param {Date|Timestamp|string|null|undefined} date - La fecha a convertir
 * @returns {string|null} - Fecha en formato ISO o null si no hay fecha
 */
export const dateToISOString = (date) => {
    if (!date) return null;
    
    let d = date;
    
    // Si es un Timestamp de Firestore, convertir a Date
    if (typeof date.toDate === 'function') {
        d = date.toDate();
    }
    
    // Si no es una instancia de Date, crear una nueva
    if (!(d instanceof Date)) {
        d = new Date(d);
    }
    
    // Verificar que la fecha sea válida
    if (isNaN(d.getTime())) {
        return null;
    }
    
    return d.toISOString();
};

/**
 * Convierte un string ISO a objeto Date para componentes que requieren Date
 * @param {string|null|undefined} isoString - String ISO de fecha
 * @returns {Date|null} - Objeto Date o null si no es válido
 */
export const convertISOToDate = (isoString) => {
    if (!isoString) return null;
    
    try {
        const date = new Date(isoString);
        // Verificar que la fecha sea válida
        if (isNaN(date.getTime())) {
            return null;
        }
        return date;
    } catch {
        return null;
    }
};

export const formatDateFields = (data, dateFields = ['createdAt', 'updatedAt', 'birthdate']) => {
    const formattedData = { ...data };
    
    dateFields.forEach(field => {
        if (data[field]) {
            formattedData[field] = formatDate(data[field]);
        }
    });
    
    return formattedData;
};

/**
 * Convierte múltiples campos de fecha a formato ISO en un objeto
 * @param {Object} data - Objeto con campos de fecha
 * @param {Array} dateFields - Array con los nombres de los campos de fecha a convertir
 * @returns {Object} - Objeto con las fechas en formato ISO
 */
export const convertDateFieldsToISO = (data, dateFields = ['createdAt', 'updatedAt', 'birthdate']) => {
    const convertedData = { ...data };
    
    dateFields.forEach(field => {
        if (data[field]) {
            convertedData[field] = dateToISOString(data[field]);
        }
    });
    
    return convertedData;
};
