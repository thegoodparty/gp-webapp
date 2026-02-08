'use client'
import { useRouter } from 'next/navigation'
import GoogleLoginButton from './GoogleLoginButton'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useUser } from '@shared/hooks/useUser'
import Overline from '@shared/typography/Overline'
import saveToken from 'helpers/saveToken'
import { useSnackbar } from 'helpers/useSnackbar'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { identifyUser } from '@shared/utils/analytics'
import { doLoginRedirect } from '@shared/utils/doLoginRedirect'
import { User } from 'helpers/types'

interface SocialLoginPayload {
  email: string
  socialPic: string
  socialProvider: string
  socialToken: string | undefined
}

interface SocialUser {
  _profile: { email: string; profilePicURL: string }
  _provider: string
  _token: { idToken: string; accessToken?: string }
}

interface LoginResponse {
  user: User
  token: string
}

async function login(payload: SocialLoginPayload): Promise<LoginResponse | false> {
  try {
    const resp = await clientFetch<LoginResponse>(
      apiRoutes.authentication.socialLogin,
      payload,
    )
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export default function SocialLoginButtons(): React.JSX.Element {
  const { successSnackbar, errorSnackbar } = useSnackbar()
  const [_, setUser] = useUser()
  const router = useRouter()

  const socialLoginCallback = async (socialUser: SocialUser): Promise<void> => {
    const profile = socialUser._profile
    const provider = socialUser._provider
    const { email, profilePicURL } = profile
    // for facebook - get a larger image
    let socialPic: string = profilePicURL
    let idToken: string | undefined
    if (provider === 'facebook') {
      try {
        idToken = socialUser._token.accessToken
      } catch (e) {
        console.log('fb API error')
      }
    } else if (provider === 'google') {
      // for google removing the "=s96-c" at the end of the string returns a large image.
      try {
        const largeImg = profilePicURL.substring(0, profilePicURL.indexOf('='))
        if (largeImg) {
          socialPic = largeImg
        }
        ;({ idToken } = socialUser._token)
      } catch (e) {
        console.log('large image error')
      }
    }

    const payload = {
      email,
      socialPic,
      socialProvider: provider,
      socialToken: idToken,
    }

    const result = await login(payload)
    if (result && result.user) {
      const { user, token } = result
      await saveToken(token)
      setUser(user)
      const { id, email: userEmail, firstName, lastName, phone, zip } = user
      await identifyUser(id, { 
        email: userEmail, 
        firstName: firstName ?? undefined, 
        lastName: lastName ?? undefined, 
        phone: phone ?? undefined, 
        zip: zip ?? undefined 
      })
      successSnackbar('Welcome back to GoodParty.org!')
      await doLoginRedirect(router, user, undefined)
    } else {
      errorSnackbar('Error [loginType] in')
    }
  }

  return (
    <>
      <div className="my-4 h-4 relative">
        <div className="border-b border-neutral-200 h-4" />
        <div className="absolute w-full text-center top-1  ">
          <Overline className="bg-white inline-block px-3">
            OR CONTINUE WITH
          </Overline>
        </div>
      </div>

      <GoogleOAuthProvider clientId="28351607421-c9m6ig3vmto6hpke4g96ukgfl3vvko7g.apps.googleusercontent.com">
        <GoogleLoginButton loginSuccessCallback={socialLoginCallback} />
      </GoogleOAuthProvider>
    </>
  )
}
