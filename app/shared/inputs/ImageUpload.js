'use client';
import { useState } from 'react';
import { RiImageAddFill } from 'react-icons/ri';
import Button from '@mui/material/Button';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useSnackbar } from 'helpers/useSnackbar';

const fileSelect = async (image, isUserImage) => {
  let api;
  if (isUserImage) {
    api = gpApi.user.uploadAvatar;
  } else {
    api = gpApi.uploadImage;
  }
  const formData = new FormData();
  formData.append('files[0]', image);
  const res = await gpFetch(api, formData, false, false, true);
  return res.success && res.data.files.length > 0
    ? `${res.data.baseurl}${res.data.files[0]}`
    : false;
};

export default function ImageUpload({
  uploadCallback,
  maxFileSize,
  customElement,
  isUserImage,
  customId = 'file-uploader',
}) {
  const { successSnackbar } = useSnackbar();
  const [fileSizeError, setFileSizeError] = useState(false);

  const handleUploadImage = async () => {
    setFileSizeError(false);
    const node = document.getElementById(customId);
    const file = node.files ? node.files[0] : false;
    if (file) {
      if (file.size > maxFileSize) {
        setFileSizeError(true);
        return;
      }
      successSnackbar('Uploading Image...');
      const url = await fileSelect(file, isUserImage);
      uploadCallback(url);
    }
  };

  return (
    <>
      {customElement ? (
        <Button
          component="label"
          style={{
            textTransform: 'none',
            fontSize: '16px',
            padding: 0,
            lineHeight: '1.3',
          }}
        >
          {customElement}
          <input
            type="file"
            hidden
            onChange={handleUploadImage}
            accept="image/*"
            id={customId}
          />
        </Button>
      ) : (
        <Button
          component="label"
          style={{
            textTransform: 'none',
            fontSize: '16px',
            padding: '16px 24px',
            lineHeight: '1.3',
            backgroundColor: '#000',
            color: '#fff',
            fontWeight: '700',
          }}
        >
          <div className="flex items-center">
            <RiImageAddFill /> &nbsp; <strong>Select</strong> &nbsp;&nbsp;
          </div>
          <input
            type="file"
            hidden
            onChange={handleUploadImage}
            accept="image/*"
            id={customId}
          />
        </Button>
      )}
      {fileSizeError && (
        <div className="mt-3 text-red-600">
          Max file size allowed: {maxFileSize / 1000}K{' '}
        </div>
      )}
    </>
  );
}
