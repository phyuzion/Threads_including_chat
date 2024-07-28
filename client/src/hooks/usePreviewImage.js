import React from 'react';
import { useToast } from '@chakra-ui/react';
import useShowToast from './useShowToast';

const usePreviewImage = () => {
  const [previewImage, setPreviewImage] = React.useState(null);
  const showToast = useShowToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB = 2 * 1024 * 1024 bytes
      showToast('File too large', 'File size must be less than 2MB.', 'error');
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      showToast('Invalid file type', 'Please select an image file', 'error');
      setPreviewImage(null);
    }
  };

  return {
    handleImageChange,
    previewImage,
    setPreviewImage,
  };
};

export default usePreviewImage;
