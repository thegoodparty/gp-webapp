import React, { useRef, useState } from 'react';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';
import TextField from '@shared/inputs/TextField';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { CircularProgress } from '@mui/material';
import { HiddenFileUploadInput } from '@shared/inputs/HiddenFileUploadInput';

export const CommitteeSupportingFilesUpload = ({
  campaign = {},
  onUploadSuccess = () => {},
}) => {
  const { id: campaignId } = campaign;
  const fileInputRef = useRef(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [loadingFileUpload, setLoadingFileUpload] = useState(false);

  const onFileBrowseClick = (e) => {
    fileInputRef.current.click();
  };

  const handleFileChoose = async (fileData, file) => {
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
    <div className="grid grid-cols-10 gap-4">
      <TextField
        className="cursor-pointer col-span-10 md:col-span-7"
        value={fileInfo?.name}
        onClick={onFileBrowseClick}
        placeholder="Upload supporting documentation"
        disabled={loadingFileUpload}
      />

      <PrimaryButton
        component="label"
        className="flex items-center justify-center col-span-10 md:col-span-3"
        role={undefined}
        variant="outlined"
        onClick={onFileBrowseClick}
        disabled={loadingFileUpload}
        fullWidth
      >
        <span>Browse</span>
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
