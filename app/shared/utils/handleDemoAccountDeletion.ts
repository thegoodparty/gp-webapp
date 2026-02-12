import { deleteDemoCampaign } from '@shared/utils/deleteDemoCampaign'
import { updateUser } from 'helpers/userHelper'
import { doPostAuthRedirect } from 'app/(candidate)/onboarding/shared/ajaxActions'

export const handleDemoAccountDeletion =
  (errorSnackbar: (message: string) => void) => async (): Promise<void> => {
    try {
      await deleteDemoCampaign()
      await updateUser()
      const redirect = await doPostAuthRedirect()
      window.location.href = typeof redirect === 'string' ? redirect : '/'
    } catch (e) {
      console.error(e)
      errorSnackbar('Error clearing demo campaign')
    }
  }
