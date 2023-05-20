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

function ImageSection() {
  const userState = useHookstate(globalUserState);
  const user = userState.get();
  const [uploadedImage, setUploadedImage] = useState(false);

  let updatedUser = uploadedImage ? { avatar: uploadedImage } : user;

  useEffect(() => {
    if (uploadedImage) {
      const updatedUser = getUserCookie(true);
      userState.set(() => updatedUser);
    }
  }, [uploadedImage]);
  return (
    <section>
      <div className="flex items-center flex-col mb-12">
        <UserAvatar user={updatedUser} size="large" />
        <br />
        <ImageUpload
          customElement={<div className="underline">Change Photo</div>}
          isUserImage
          uploadCallback={(image) => setUploadedImage(image)}
          maxFileSize={1000000}
        />
      </div>
    </section>
  );
}

export default ImageSection;
