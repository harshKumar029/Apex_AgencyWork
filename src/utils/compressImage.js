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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
  // Use more aggressive compression settings to ensure the final size is below 150KB.
  const options = {
    maxSizeMB: maxSizeKB / 1024, // Convert KB to MB
    maxWidthOrHeight: 600, // Reduce dimensions to speed up and ensure smaller file size
    useWebWorker: true,
    initialQuality: 0.6, // Lower initial quality for more compression
<<<<<<< HEAD
=======
=======
  const options = {
    maxSizeMB: maxSizeKB / 1024, // Convert KB to MB
    maxWidthOrHeight: 1920, // Optional: Resize to a maximum of 1920px
    useWebWorker: true, // Use Web Workers for faster compression
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
    
    // Check if the compressed file exceeds the size limit
    if (compressedFile.size / 1024 > maxSizeKB) {
      // Optionally, you can implement further compression or notify the user
      console.warn('Compressed image is still larger than the desired size.');
    }

>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    throw error;
  }
};
