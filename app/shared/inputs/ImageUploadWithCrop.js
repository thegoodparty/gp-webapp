'use client';
import React, { useRef, useState } from 'react';
import { RiImageAddFill } from 'react-icons/ri';
import Button from '@mui/material/Button';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import Modal from '@shared/utils/Modal';
import 'react-image-crop/dist/ReactCrop.css';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { useDebounceEffect } from '@shared/hooks/useDebounceEffect';
import { canvasPreview } from '@shared/CanvasPreview';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

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
  if (res.success && res.data.files.length > 0) {
    if (isUserImage) {
      setUserCookie(res.updatedUser);
    }
    return `${res.data.baseurl}${res.data.files[0]}`;
  } else {
    return false;
  }
};

const uploadImage = async (image) => {
  try {
    const api = gpApi.uploadBase64Image;
    const payload = {
      image,
    };
    const { url } = await gpFetch(api, payload);
    console.log('res', url);
    return url;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};

export default function ImageUploadWithCrop({
  uploadCallback,
  customElement,
  isUserImage,
  customId = 'file-uploader',
}) {
  // const snackbarState = useHookstate(globalSnackbarState);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({
    unit: '%', // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [imgSrc, setImgSrc] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [completedCrop, setCompletedCrop] = useState(null);
  const previewCanvasRef = useRef(null);

  const aspect = 1;

  const handleUploadImage = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setShowModal(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  const handleSave = async () => {
    const canvas = previewCanvasRef.current;
    console.log('canvas', canvas.toDataURL('image/jpeg'));
    const base64 = canvas.toDataURL('image/jpeg');
    const url = await uploadImage(base64);
    console.log('handle save url', url);
    setShowModal(false);
    setImgSrc('');
    setCompletedCrop(null);
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop],
  );

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

      {showModal && (
        <Modal open={showModal} closeCallback={() => setShowModal(false)}>
          <div className="p-2">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                // style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
                className=" h-[70vh] w-auto"
              />
            </ReactCrop>
            <div className="absolute opacity-0 left-[3000px]">
              <canvas
                ref={previewCanvasRef}
                style={{
                  width: completedCrop?.width ?? 0,
                  height: completedCrop?.height ?? 0,
                }}
              />
            </div>
            <div onClick={handleSave} className="text-center">
              <PrimaryButton>Save</PrimaryButton>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
