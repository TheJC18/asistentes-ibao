/**
 * Sube un archivo a Cloudinary y retorna la URL
 */
export const fileUpload = async (file: File): Promise<string | null> => {
  if (!file) {
    throw new Error('No hay archivo para subir');
  }

  const cloudUrl = 'https://api.cloudinary.com/v1_1/dkgd92zor/upload';

  const formData = new FormData();
  formData.append('upload_preset', 'react-journal');
  formData.append('file', file);

  try {
    const resp = await fetch(cloudUrl, {
      method: 'POST',
      body: formData
    });

    if (!resp.ok) {
      throw new Error('No se pudo subir imagen');
    }

    const cloudResp = await resp.json();
    return cloudResp.secure_url;
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    throw error;
  }
};
