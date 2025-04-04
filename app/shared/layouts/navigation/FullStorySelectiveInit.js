'use client'

import { getCookie } from 'helpers/cookieHelper'
import { userIsAdmin } from 'helpers/userHelper'
import { useEffect } from 'react'

export default function FullStorySelectiveInit({ user }) {
  useEffect(() => {
    if (user) {
      fullstoryIdentity(user)
    }
  }, [user])

  const fullstoryIdentity = (userI) => {
    if (typeof FS === 'undefined') {
      return
    }
    const impersonateUser = getCookie('impersonateUser')
    if (impersonateUser) {
      FS('shutdown')
      return
    }
    if (userI && userI.email) {
      const domain = userI.email.split('@')[1]
      if (domain === 'goodparty.org' || userIsAdmin(userI)) {
        FS('shutdown')
      } else {
        FS('setIdentity', {
          uid: userI.id,
          properties: {
            displayName: `${userI.firstName} ${userI.lastName}`,
            email: userI.email,
          },
        })
      }
    }
  }
}
