import React, { useRef, useState } from 'react';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';
import TextField from '@shared/inputs/TextField';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { CircularProgress } from '@mui/material';
import { HiddenFileUploadInput } from '@shared/inputs/HiddenFileUploadInput';

const FILE_LIMIT_MB = 10;

export const CommitteeSupportingFilesUpload = ({
  campaign = {},
  inputValue = '',
  onUploadSuccess = () => {},
  onUploadError = (e) => {},
}) => {
  const { id: campaignId } = campaign;
  const fileInputRef = useRef(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [loadingFileUpload, setLoadingFileUpload] = useState(false);
  const [errorMessge, setErrorMessage] = useState('');

  const onFileBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChoose = async (fileData, file) => {
    setErrorMessage(``);
    const fileSizeMb = file?.size / 1e6;
    if (fileSizeMb > FILE_LIMIT_MB) {
      setErrorMessage(
        `File size of ${fileSizeMb.toFixed(
          2,
        )}MB is larger than ${FILE_LIMIT_MB}MB limit`,
      );
      onUploadError(new Error('File size too large'));
      return;
    }
    setLoadingFileUpload(true);
    setFileInfo(file);
    const formData = new FormData();
    formData.append('document', file);
    const apiConfig = campaignId
      ? {
          ...gpApi.campaign.einSupportingDocumentUpload,
          url: `${gpApi.campaign.einSupportingDocumentUpload.url}/${campaignId}`,
        }
      : gpApi.campaign.einSupportingDocumentUpload;

    try {
      const result = await gpFetch(apiConfig, formData, null, null, true);
      onUploadSuccess(result);
    } catch (e) {
      console.error('Error uploading file', e);
    } finally {
      setLoadingFileUpload(false);
    }
  };

  return (
    <div className="grid grid-cols-10 gap-6 align-center mt-4">
      <TextField
        error={Boolean(errorMessge)}
        className="cursor-pointer col-span-10 md:col-span-7"
        value={fileInfo?.name || inputValue || ''}
        onClick={onFileBrowseClick}
        label="Upload Campaign Filing Document"
        disabled={loadingFileUpload}
        helperText={errorMessge || `File size less than ${FILE_LIMIT_MB}MB`}
      />

      <PrimaryButton
        component="label"
        className="flex items-center justify-center h-[56px] col-span-10 md:col-span-3 md:mt-[5px] md:h-[51px]"
        role={undefined}
        variant="outlined"
        onClick={onFileBrowseClick}
        disabled={loadingFileUpload}
        fullWidth
      >
        <span>Upload</span>
        {loadingFileUpload && (
          <CircularProgress className="text-primary-light ml-2" size={16} />
        )}
        <HiddenFileUploadInput
          ref={fileInputRef}
          onChange={handleFileChoose}
          accept=".pdf"
        />
      </PrimaryButton>
    </div>
  );
};
