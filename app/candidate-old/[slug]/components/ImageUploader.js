'use client';

import WarningButton from '@shared/buttons/WarningButton';
import ImageUpload from '@shared/inputs/ImageUpload';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { FaCamera } from 'react-icons/fa';

export default function ImageUploader({ campaign }) {
  const handleUpload = async (url) => {
    console.log('url', url);
    await updateCampaign({
      ...campaign,
      image: url,
    });
    window.location.reload();
  };

  return (
    <div className="absolute w-full h-full flex items-center justify-center top-0 left-0">
      <ImageUpload
        uploadCallback={handleUpload}
        maxFileSize={4000000}
        customElement={<WarningButton size="small">Edit Image</WarningButton>}
      />
    </div>
  );
}
