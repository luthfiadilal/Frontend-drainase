import imageCompression from 'browser-image-compression';

export const compressImage = async (file, maxWidth = 1024, quality = 0.7) => {
  if (!file || !file.type.match(/image.*/)) {
    return file;
  }

  const options = {
    maxSizeMB: 1, // Target size in MB
    maxWidthOrHeight: maxWidth,
    useWebWorker: true, // Use Web Workers for faster processing off the main thread
    initialQuality: quality,
    fileType: 'image/jpeg'
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    // Create a new File object with a .jpg extension
    const newFile = new File(
      [compressedBlob], 
      file.name.replace(/\.[^/.]+$/, "") + ".jpg", 
      {
        type: 'image/jpeg',
        lastModified: Date.now(),
      }
    );
    return newFile;
  } catch (error) {
    console.error("Gagal melakukan kompresi gambar:", error);
    return file; // Fallback to original file if compression fails
  }
};
