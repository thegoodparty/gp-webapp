import React, { useRef, useState } from 'react';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';
import TextField from '@shared/inputs/TextField';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { CircularProgress } from '@mui/material';
import { HiddenFileUploadInput } from '@shared/inputs/HiddenFileUploadInput';
import { useCampaign } from '@shared/hooks/useCampaign';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';

const FILE_LIMIT_MB = 10;

const EIN_SUPPORT_DOCUMENT_FOLDERNAME_POSTFIX = `ein-support-documents`;

const getEinSupportDocumentFolderName = (id, slug) =>
  `${id}-${slug}-${EIN_SUPPORT_DOCUMENT_FOLDERNAME_POSTFIX}`;

const uploadFileToS3 = async (file, bucket) => {
  const { name: fileName, type: fileType } = file;
  const { signedUploadUrl } = await gpFetch(
    gpApi.user.files.generateSignedUploadUrl,
    {
      fileType,
      fileName,
      bucket,
    },
  );
  const formData = new FormData();
  formData.append('document', file);
  return await fetch(signedUploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': fileType,
    },
    body: formData,
  });
};

export const CommitteeSupportingFilesUpload = ({
  campaign = {},
  inputValue = '',
  onUploadSuccess = () => {},
  onUploadError = (e) => {},
}) => {
  const [authenticatedCampaign = {}] = useCampaign();
  const campaignId = campaign?.id || authenticatedCampaign?.id;
  const campaignSlug = campaign?.slug || authenticatedCampaign?.slug;
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

    try {
      const bucketFolderName = getEinSupportDocumentFolderName(
        campaignId,
        campaignSlug,
      );
      const bucket = `ein-supporting-documents/${bucketFolderName}`;
      const result = await uploadFileToS3(file, bucket);
      await updateCampaign(
        [
          {
            key: 'details.einSupportingDocument',
            value: `${bucketFolderName}/${file.name}`,
          },
        ],
        campaignSlug,
      );
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
