'use client';

import WarningButton from '@shared/buttons/WarningButton';
import ImageUpload from '@shared/inputs/ImageUpload';
import { revalidateCandidates } from 'helpers/cacheHelper';

export default function ImageUploader({
  campaign,
  candidate,
  isStaged,
  saveCallback,
}) {
  const handleUpload = async (url) => {
    if (isStaged && campaign) {
      await saveCallback({
        ...campaign,
        image: url,
      });
    } else {
      await saveCallback({
        ...candidate,
        image: url,
      });
      revalidateCandidates();
    }
    window.location.reload();
  };

  return (
    <div className="absolute w-full h-full flex items-center justify-center top-0 left-0">
      <ImageUpload
        uploadCallback={handleUpload}
        maxFileSize={4000000}
        customElement={
          <div className="bg-lime-400 text-primary text-sm py-1 px-3">
            Edit Image
          </div>
        }
      />
    </div>
  );
}
