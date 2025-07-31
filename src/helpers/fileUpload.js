
export const fileUpload = async( file ) => {

    if (!file) throw new Error('No hay ningún archivo para subir');

    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dkgd92zor/upload';
  
    const formData = new FormData();
    formData.append('upload_preset', 'react-journal');
    formData.append('file', file);

    try {

        const response = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) throw new Error('Error al subir el archivo');
        const cloudResponse = await response.json();

        return cloudResponse.secure_url; // Retorna la URL del archivo subido


    } catch (error) {
        throw new Error(error.message);
    }
}