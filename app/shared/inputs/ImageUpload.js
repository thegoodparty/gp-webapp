'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import React, { useState } from 'react';
import { RiImageAddFill } from 'react-icons/ri';
import Button from '@mui/material/Button';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

const fileSelect = async (image, isUserImage) => {
  let api;
  if (isUserImage) {
    api = gpApi.user.uploadAvatar;
  } else {
    api = gpApi.candidateApplication.uploadImage;
  }

  const formData = new FormData();
  formData.append('files[0]', image);
  const res = await gpFetch(api, formData, false, false, true);
  if (res.success && res.data.files.length > 0) {
    if (isUserImage) {
      setUserCookie(res.updatedUser);
    }
    return `${res.data.baseurl}${res.data.files[0]}`;
  } else {
    return false;
  }
};

export default function ImageUpload({
  fileSelectCallback,
  uploadCallback,
  maxFileSize,
  customElement,
  isUserImage,
}) {
  const snackbarState = useHookstate(globalSnackbarState);
  const [fileSizeError, setFileSizeError] = useState(false);

  const handleUploadImage = async () => {
    setFileSizeError(false);
    const node = document.getElementById('file-uploader');
    const file = node.files ? node.files[0] : false;
    if (file) {
      if (file.size > maxFileSize) {
        setFileSizeError(true);
        return;
      }
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Uploading Image...',
          isError: false,
        };
      });
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
            id="file-uploader"
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
            id="file-uploader"
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
