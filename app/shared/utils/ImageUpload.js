'use client';
/**
 *
 * ImageUploadWrapper
 *
 */

import React, { useState } from 'react';
import { RiImageAddFill } from 'react-icons/ri';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

async function fileSelectCallback(image, uploadCallback) {
  const api = gpApi.user.uploadAvatar;
  const formData = new FormData();
  formData.append('file', image, image.name);
  const res = await gpFetch(api, formData, 3600, false, true);
  if (res.avatar) {
    uploadCallback(res.avatar);
  } else {
    uploadCallback(false);
  }
}

function ImageUploadWrapper({
  uploadCallback,
  maxFileSize,
  customElement,
  loadingStatusCallback = () => {},
}) {
  const [fileSizeError, setFileSizeError] = useState(false);

  const handleUploadImage = async (img) => {
    loadingStatusCallback(true);
    setFileSizeError(false);
    const node = document.getElementById('file-uploader');
    const file = node.files ? node.files[0] : false;
    if (file) {
      if (file.size > maxFileSize) {
        setFileSizeError(true);
        return;
      }
      await fileSelectCallback(file, uploadCallback);
      loadingStatusCallback(false);
    }
  };

  return (
    <>
      {customElement ? (
        <label className={'transform-none text-base p-0 cursor-pointer'}>
          {customElement}
          <input
            type="file"
            hidden
            onChange={handleUploadImage}
            accept="image/*"
            id="file-uploader"
          />
        </label>
      ) : (
        <BlackButtonClient className="bg-black text-white py-0 px-6 font-bold">
          <RiImageAddFill /> &nbsp; Select &nbsp;&nbsp;
          <input
            type="file"
            hidden
            onChange={handleUploadImage}
            accept="image/*"
            id="file-uploader"
          />
        </BlackButtonClient>
      )}
      {fileSizeError && (
        <div className="mt-3 text-red-600">
          Max file size allowed: {maxFileSize / 1000}K{' '}
        </div>
      )}
    </>
  );
}

export default ImageUploadWrapper;
