// src/utils/cloudinaryUpload.ts
import axios from 'axios';

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const CLOUDNARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
    const uploadPreset = 'aoh4fpwm';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset); // Replace with your upload preset
  formData.append('cloud_name', CLOUDNARY_NAME); // Replace with your cloud name

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDNARY_NAME}/image/upload`, // Replace with your cloud name
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.secure_url) {
      return response.data; // Return the URL of the uploaded image
    } else {
      throw new Error('Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};