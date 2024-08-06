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
    <div>
      <div className="flex items-center flex-col">
        <UserAvatar user={updatedUser} size="large" />
        <ImageUpload
          customElement={<Body2 className="underline">Change Photo</Body2>}
          isUserImage
          uploadCallback={(image) => setUploadedImage(image)}
          maxFileSize={1000000}
        />
      </div>
    </div>
  );
}

export default ImageSection;
