import { deleteDemoCampaign } from '@shared/utils/deleteDemoCampaign';

export const handleDemoAccountDeletion =
  (snackbarState, router) => async () => {
    try {
      await deleteDemoCampaign();
    } catch (e) {
      console.error(e);
      snackbarState.set(() => ({
        isOpen: true,
        message: 'Error clearing demo campaign',
        isError: true,
      }));
      return;
    }
    router.push('/account-type');
  };
