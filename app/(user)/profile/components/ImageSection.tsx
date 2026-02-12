'use client'
/**
 *
 * ImageSection
 *
 */

import { useEffect, useState } from 'react'
import UserAvatar from '@shared/user/UserAvatar'
import ImageUpload from '@shared/utils/ImageUpload'
import { getUserCookie } from 'helpers/cookieHelper'
import Body2 from '@shared/typography/Body2'
import { useUser } from '@shared/hooks/useUser'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { User } from 'helpers/types'

const ImageSection = (): React.JSX.Element => {
  const [user, setUser] = useUser()
  const [loading, setLoading] = useState(false)

  const [uploadedImage, setUploadedImage] = useState<string | false>(false)

  const updatedUser: User | null =
    uploadedImage && user ? { ...user, avatar: uploadedImage } : user

  useEffect(() => {
    if (uploadedImage) {
      const updated = getUserCookie(true)
      if (updated) {
        setUser(updated)
      }
    }
  }, [uploadedImage])

  return (
    <div className="flex mb-8">
      <div className="p-4 bg-gray-200 rounded-2xl mr-4 border border-gray-300">
        {loading ? (
          <>Updating...</>
        ) : (
          <UserAvatar user={updatedUser} size="large" />
        )}
      </div>
      <div>
        <ImageUpload
          customElement={
            <div
              onClick={() =>
                trackEvent(EVENTS.Settings.PersonalInfo.ClickUpload)
              }
              className={`
                text-lg
                py-3
                px-6
                rounded-lg
                font-medium
                bg-primary-dark
                text-slate-50
                inline-block
                ${loading ? 'bg-primary-light' : 'bg-primary-dark'}
              `}
            >
              {loading ? 'Updating...' : 'Upload Image'}
            </div>
          }
          uploadCallback={(image: string | false) => setUploadedImage(image)}
          maxFileSize={1000000}
          loadingStatusCallback={(loading: boolean) => setLoading(loading)}
        />
        <Body2 className="mt-2">File size less than 1mb. JPG or PNG.</Body2>
      </div>
    </div>
  )
}

export default ImageSection
