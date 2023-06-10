'use client';

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
    <div className="absolute bottom-0 right-6">
      <ImageUpload
        uploadCallback={handleUpload}
        maxFileSize={4000000}
        customElement={
          <div className="text-2xl w-12 h-12 rounded-full text-zinc-500 bg-zinc-300 flex items-center justify-center border-2 border-white cursor-pointer transition-transform hover:rotate-12">
            <FaCamera />
          </div>
        }
      />
    </div>
  );
}
