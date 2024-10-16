import { deleteDemoCampaign } from '@shared/utils/deleteDemoCampaign';
import { updateUser } from 'helpers/userHelper';

export const handleDemoAccountDeletion =
  (snackbarState, router) => async () => {
    try {
      await deleteDemoCampaign();
      await updateUser();
    } catch (e) {
      console.error(e);
      snackbarState.set(() => ({
        isOpen: true,
        message: 'Error clearing demo campaign',
        isError: true,
      }));
      return;
    }
    router.push('/sign-up/account-type');
  };
