'use client';
/**
 *
 * ImageSection
 *
 */

import React, { useEffect, useState } from 'react';
import UserAvatar from '@shared/user/UserAvatar';
import ImageUpload from '@shared/utils/ImageUpload';
import { useHookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/RegisterOrProfile';
import { getUserCookie } from 'helpers/cookieHelper';
import { useRouter } from 'next/navigation';
import Body2 from '@shared/typography/Body2';

function ImageSection() {
  const userState = useHookstate(globalUserState);
  const user = userState.get();
  const [uploadedImage, setUploadedImage] = useState(false);

  let updatedUser = uploadedImage ? { avatar: uploadedImage } : user;

  useEffect(() => {
    if (uploadedImage) {
      const updated = getUserCookie(true);
      userState.set(() => updated);
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
