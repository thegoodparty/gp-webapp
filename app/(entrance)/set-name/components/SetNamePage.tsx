'use client'
import MaxWidth from '@shared/layouts/MaxWidth'
import { useState } from 'react'
import { doPostAuthRedirect } from 'app/(candidate)/onboarding/shared/ajaxActions'
import H1 from '@shared/typography/H1'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import TextField from '@shared/inputs/TextField'
import { deleteCookie, getCookie } from 'helpers/cookieHelper'
import { updateUser } from 'helpers/userHelper'
import { useSnackbar } from 'helpers/useSnackbar'

interface SetNameState {
  firstName: string
  lastName: string
  processing: boolean
}

export default function SetNamePage(): React.JSX.Element {
  const [state, setState] = useState<SetNameState>({
    firstName: '',
    lastName: '',
    processing: false,
  })
  const { errorSnackbar } = useSnackbar()

  const enableSubmit = () =>
    !state.processing && state.firstName !== '' && state.lastName !== ''

  const handleSubmit = async () => {
    if (enableSubmit()) {
      setState({ ...state, processing: true })
      await updateUser({
        firstName: state.firstName,
        lastName: state.lastName,
      })

      const returnUrl = getCookie('returnUrl')
      if (returnUrl) {
        deleteCookie('returnUrl')
        window.location.href = returnUrl
      } else {
        const redirect = await doPostAuthRedirect()
        window.location.href = redirect || '/dashboard'
      }
    } else {
      errorSnackbar('Error creating campaign')
    }
  }

  const onChangeField = (value: string, key: keyof SetNameState) => {
    setState({
      ...state,
      [key]: value,
    })
  }

  return (
    <MaxWidth>
      <div className="flex justify-center min-h-[calc(100vh-56px)]">
        <div className="grid py-6 max-w-lg w-[75vw]">
          <div className="text-center mb-8 pt-8">
            <H1>Before we start, please provide your name</H1>

            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
              }}
              id="set-name-page-form"
            >
              <div className="flex mt-12">
                <TextField
                  onChange={(e) => onChangeField(e.target.value, 'firstName')}
                  fullWidth
                  value={state.firstName}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="First Name"
                />
              </div>
              <div className="flex mt-6">
                <TextField
                  onChange={(e) => onChangeField(e.target.value, 'lastName')}
                  fullWidth
                  value={state.lastName}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Last Name"
                />
              </div>

              <div className="flex mt-5 justify-center" onClick={handleSubmit}>
                <PrimaryButton disabled={!enableSubmit()} type="submit">
                  Next
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MaxWidth>
  )
}
