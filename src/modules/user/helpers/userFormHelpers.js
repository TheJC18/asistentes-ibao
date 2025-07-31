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
      // Convertir la fecha a cadena ISO para consistencia
      const dateString = selectedDates[0].toISOString().split('T')[0];
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
