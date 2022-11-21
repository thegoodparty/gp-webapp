'use client';
/**
 *
 * ImageUploadWrapper
 *
 */

import React, { useState } from 'react';
import { RiImageAddFill } from 'react-icons/ri';
import Button from '@mui/material/Button';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

async function fileSelectCallback(image, uploadCallback, isUserImage) {
    let api;
    if (isUserImage) {
      api = gpApi.uploadAvatar;
    } else {
      api = gpApi.candidateApplication.uploadImage;
    }
    const formData = new FormData();
    formData.append('files[0]', image);
    const res = await gpFetch(api, formData, 3600, true);
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
                <Button variant="contained" component="label" className="bg-black text-white py-3 px-0 font-bold">
                    <BlackButtonClient style={{padding: "0 24px"}}>
                        <RiImageAddFill /> &nbsp; Select &nbsp;&nbsp;
                        <input
                        type="file"
                        hidden
                        onChange={handleUploadImage}
                        accept="image/*"
                        id="file-uploader"
                        />
                    </BlackButtonClient>
                </Button>
            )}
            {fileSizeError && (
                <div className="mt-3 text-red-600">Max file size allowed: {maxFileSize / 1000}K </div>
            )}
        </>
    );
}

export default ImageUploadWrapper;
