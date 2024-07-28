import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import useShowToast from './useShowToast';

const usePreviewVideo = () => {
  const [previewVideo, setPreviewVideo] = useState(null);
  const showToast = useShowToast();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 100 * 1024 * 1024) { // 100MB = 100 * 1024 * 1024 bytes
      showToast('File too large', 'File size must be less than 100MB.', 'error');
      return;
    }

    if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreviewVideo(url);
    } else {
      showToast('Invalid file type', 'Please select a video file', 'error');
      setPreviewVideo(null);
    }
  };

  return {
    handleVideoChange,
    previewVideo,
    setPreviewVideo,
  };
};

export default usePreviewVideo;
