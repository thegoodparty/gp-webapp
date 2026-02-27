'use client'
import BlackButtonClient from '@shared/buttons/BlackButtonClient'
import { getUserCookie } from 'helpers/cookieHelper'
import { revalidatePage } from 'helpers/cacheHelper'
import { useSnackbar } from 'helpers/useSnackbar'
import { userIsAdmin } from 'helpers/userHelper'
import { ALPHABET } from '@shared/utils/alphabet'

export default function AdminInvalidateCache(): React.JSX.Element | null {
  const user = getUserCookie(true)
  const { successSnackbar } = useSnackbar()

  if (!user || !userIsAdmin(user)) {
    return null
  }

  const handleInvalidate = async () => {
    successSnackbar('Invalidating letter pages')
    ALPHABET.forEach(async (letter) => {
      await revalidatePage(`/political-terms/${letter}`)
    })
  }
  return (
    <div className="mt-4">
      <BlackButtonClient onClick={handleInvalidate}>
        <strong>(Admin) Invalidate Glossary Cache</strong>
      </BlackButtonClient>
    </div>
  )
}
