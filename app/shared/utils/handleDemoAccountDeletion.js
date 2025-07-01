import { deleteDemoCampaign } from '@shared/utils/deleteDemoCampaign'
import { updateUser } from 'helpers/userHelper'
import { handleCreateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'

export const handleDemoAccountDeletion = (errorSnackbar) => async () => {
  try {
    await deleteDemoCampaign()
    await updateUser()
    const redirect = await handleCreateCampaign()
    window.location.href = redirect
  } catch (e) {
    console.error(e)
    errorSnackbar('Error clearing demo campaign')
    return
  }
}
