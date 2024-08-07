'use client';
/**
 *
 * ImageSection
 *
 */

import React, { useEffect, useState } from 'react';
import UserAvatar from '@shared/user/UserAvatar';
import ImageUpload from '@shared/utils/ImageUpload';
import { getUserCookie } from 'helpers/cookieHelper';
import Body2 from '@shared/typography/Body2';
import { useUser } from '@shared/hooks/useUser';
import PrimaryButton from '@shared/buttons/PrimaryButton';

function ImageSection() {
  const [user, setUser] = useUser();

  const [uploadedImage, setUploadedImage] = useState(false);

  let updatedUser = uploadedImage ? { avatar: uploadedImage } : user;

  useEffect(() => {
    if (uploadedImage) {
      const updated = getUserCookie(true);
      setUser(updated);
    }
  }, [uploadedImage]);
  return (
    <div className="flex mb-8">
      <div className="p-4 bg-gray-200 rounded-2xl mr-4 border border-gray-300">
        <UserAvatar user={updatedUser} size="large" />
      </div>
      <div>
        <ImageUpload
          customElement={
            <div className="text-lg py-3 px-6 rounded-lg font-medium bg-primary-dark text-slate-50 inline-block">
              Upload Image
            </div>
          }
          isUserImage
          uploadCallback={(image) => setUploadedImage(image)}
          maxFileSize={1000000}
        />
        <Body2 className="mt-2">File size less than 1mb. JPG or PNG.</Body2>
      </div>
    </div>
  );
}

export default ImageSection;
