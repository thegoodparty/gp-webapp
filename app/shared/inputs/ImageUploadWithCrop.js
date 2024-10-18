'use client';
import React, { useRef, useState } from 'react';
import { RiImageAddFill } from 'react-icons/ri';
import Button from '@mui/material/Button';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import Modal from '@shared/utils/Modal';
import 'react-image-crop/dist/ReactCrop.css';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { useDebounceEffect } from '@shared/hooks/useDebounceEffect';
import { canvasPreview } from '@shared/CanvasPreview';
import { CircularProgress } from '@mui/material';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 10,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const uploadImage = async (image) => {
  try {
    const api = gpApi.uploadBase64Image;
    const payload = {
      image,
    };
    const { url } = await gpFetch(api, payload);
    return url;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};

export default function ImageUploadWithCrop({
  uploadCallback,
  customElement,
  customId = 'file-uploader',
}) {
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
  const [uploading, setUploading] = useState(false);
  const [completedCrop, setCompletedCrop] = useState(null);
  const previewCanvasRef = useRef(null);

  const aspect = 1;

  const handleUploadImage = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
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
    if (!completedCrop?.width) {
      return null;
    }
    setUploading(true);
    const canvas = previewCanvasRef.current;
    const base64 = canvas.toDataURL('image/jpeg');
    const url = await uploadImage(base64);
    uploadCallback(url);

    setShowModal(false);
    setImgSrc('');
    setCompletedCrop(null);
    setUploading(false);
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
                style={{ maxHeight: '60vh' }}
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
            {uploading ? (
              <div className="text-center mt-2">
                Uploading
                <br />
                <br />
                <CircularProgress size={20} />
              </div>
            ) : (
              <div onClick={handleSave} className="text-center mt-2">
                <PrimaryButton disabled={!completedCrop?.width}>
                  Save
                </PrimaryButton>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
