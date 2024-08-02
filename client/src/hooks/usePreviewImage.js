import React from 'react';
import useShowToast from './useShowToast';

const usePreviewImage = () => {
  const [previewImage, setPreviewImage] = React.useState(null);
  const [processedImage, setProcessedImage] = React.useState(null); // webP or JPEG
  const showToast = useShowToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid file type', 'Please select an image file', 'error');
      setPreviewImage(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const convertToBlob = (type) => {
          return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), type, 0.7);
          });
        };

        const handleBlob = (blob, type) => {
          if (blob.size > 2 * 1024 * 1024) {
            showToast('File too large', 'File size must be less than 2MB.', 'error');
            return;
          }

          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, `.${type.split('/')[1]}`), { type });
          const newReader = new FileReader();
          newReader.onloadend = () => setPreviewImage(newReader.result);
          newReader.readAsDataURL(newFile);
          setProcessedImage(newFile); // set processed Image
        };

        convertToBlob('image/webp')
          .then((blob) => handleBlob(blob, 'image/webp'))
          .catch(() => {
            convertToBlob('image/jpeg')
              .then((blob) => handleBlob(blob, 'image/jpeg'))
              .catch((error) => {
                showToast('Error', 'Failed to process image.', 'error');
                console.error('Error processing image:', error);
              });
          });
      };
    };
    reader.readAsDataURL(file);
  };

  return {
    handleImageChange,
    previewImage,
    setPreviewImage,
    processedImage // Return... webP or JPEG
  };
};

export default usePreviewImage;
