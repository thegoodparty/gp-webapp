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
import { setUserCookie } from 'helpers/cookieHelper';

async function fileSelectCallback(image, uploadCallback, isUserImage) {
  let api;
  if (isUserImage) {
    api = gpApi.user.uploadAvatar;
  } else {
    api = gpApi.candidateApplication.uploadImage;
  }
  const formData = new FormData();
  formData.append('files[0]', image);
  const res = await gpFetch(api, formData, 3600, false, true);
  if (res.success && res.data.files.length > 0) {
    uploadCallback(`${res.data.baseurl}${res.data.files[0]}`);
    if (isUserImage) {
      setUserCookie(res.updatedUser);
    }
  } else {
    uploadCallback(false);
  }
}

function ImageUploadWrapper({
  uploadCallback,
  maxFileSize,
  customElement,
  isUserImage,
}) {
  const [fileSizeError, setFileSizeError] = useState(false);
  const handleUploadImage = (img) => {
    setFileSizeError(false);
    const node = document.getElementById('file-uploader');
    const file = node.files ? node.files[0] : false;
    if (file) {
      if (file.size > maxFileSize) {
        setFileSizeError(true);
        return;
      }
      fileSelectCallback(file, uploadCallback, isUserImage);
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
