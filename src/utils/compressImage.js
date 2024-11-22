// src/utils/compressImage.js

import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file to ensure it's below the specified size.
 *
 * @param {File} imageFile - The original image file to compress.
 * @param {number} maxSizeKB - The maximum allowed size in kilobytes.
 * @returns {Promise<File>} - A promise that resolves to the compressed image file.
 */
export const compressImage = async (imageFile, maxSizeKB = 150) => {
  const options = {
    maxSizeMB: maxSizeKB / 1024, // Convert KB to MB
    maxWidthOrHeight: 1920, // Optional: Resize to a maximum of 1920px
    useWebWorker: true, // Use Web Workers for faster compression
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    
    // Check if the compressed file exceeds the size limit
    if (compressedFile.size / 1024 > maxSizeKB) {
      // Optionally, you can implement further compression or notify the user
      console.warn('Compressed image is still larger than the desired size.');
    }

    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    throw error;
  }
};
