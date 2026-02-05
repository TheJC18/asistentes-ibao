// createFieldUpdater: crea función para actualizar campos del formulario
export function createFieldUpdater(setFormData) {
  return (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
}

// createFileUploadHandler: crea función para gestionar la carga de archivos y actualizar el avatar
export function createFileUploadHandler(setFormData, setFileInputValue) {
  return (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatar: previewUrl }));
    }
    setFileInputValue("");
  };
}

// createBirthdateUpdater: crea función para actualizar la fecha de nacimiento
export function createBirthdateUpdater(fieldUpdater) {
  return (selectedDates) => {
    if (Array.isArray(selectedDates) && selectedDates[0]) {
      const date = selectedDates[0];
      // Usar los métodos locales para evitar problemas de zona horaria
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      fieldUpdater("birthdate", dateString);
    }
  };
}

// createAvatarRestorer: crea función para restaurar el avatar original
export function createAvatarRestorer(setFormData, originalAvatar) {
  return () => {
    setFormData((prev) => ({ ...prev, avatar: originalAvatar }));
  };
}
