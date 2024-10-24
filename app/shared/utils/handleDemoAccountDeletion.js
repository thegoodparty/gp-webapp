import { deleteDemoCampaign } from '@shared/utils/deleteDemoCampaign';
import { updateUser } from 'helpers/userHelper';

export const handleDemoAccountDeletion =
  (errorSnackbar, router) => async () => {
    try {
      await deleteDemoCampaign();
      await updateUser();
    } catch (e) {
      console.error(e);
      errorSnackbar('Error clearing demo campaign');
      return;
    }
    router.push('/onboarding/account-type');
  };
