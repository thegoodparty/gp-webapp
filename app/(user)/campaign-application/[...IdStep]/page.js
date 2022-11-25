import {
  getApplicationStorage,
} from 'helpers/localstorageHelper';
import { getUserCookie } from 'helpers/cookieHelper';
import { cookies } from 'next/headers';
import ApplicationStep1 from './components/ApplicationStep1';
import ApplicationStep2 from './components/ApplicationStep2';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';

async function loadApplication(id) {
  try {

    // yield put(snackbarActions.showSnakbarAction('Loading your application'));
    if (id === 'guest') {
      const user = getUserCookie(true);
      if (user) {
        // yield put(push(`/profile/campaigns`));
      } else {
        const app = getApplicationStorage() || { id: 'guest' };
        // yield put(actions.loadApplicationActionSuccess(app, false));
      }
    } else {
      const nextCookies = cookies();
      const api = { ...gpApi.candidateApplication.find, authToken: nextCookies.get('token').value};
      const payload = {
        id,
      };
      const res = await gpFetch(api, payload, 3600);
      console.log('response', res)
      return res;
      // yield put(actions.loadApplicationActionSuccess(application, reviewMode));
    }
  } catch (error) {
    // yield put(
    //   snackbarActions.showSnakbarAction(
    //     'Error creating your application',
    //     'error',
    //   ),
    // );
  }
}

async function loadTopIssues() {
  try {
    const nextCookies = cookies();
    const api = { 
      ...gpApi.admin.topIssues.list, 
      authToken: nextCookies.get('token').value
    };

    const { topIssues } = await gpFetch(api, null, 3600);
    return topIssues;
    // yield put(actions.loadATopIssuesActionSuccess(topIssues));
  } catch (error) {
    console.log(error);
    // yield put(
    //   snackbarActions.showSnakbarAction('Error loading topics', 'error'),
    // );
  }
}

export default async function Page({ params }) {
  // const searchParams = useSearchParams();
  // console.log(searchParams.get('IdStep'))
  const { IdStep } = params;
  const step = parseInt(IdStep?.length > 1 ? IdStep[1] : 1);
  const id = IdStep?.length > 0 ? IdStep[0] : false;
  const { application, reviewMode } = await loadApplication(id);
  console.log(application, reviewMode)
  const issues = await loadTopIssues();
  const childProps = {
    step,
    id,
    application,
    reviewMode,
    // updateApplicationCallback,
    // submitApplicationCallback,
    // approveApplicationCallback,
    // rejectApplicationCallback,
    issues,
  };
  console.log(childProps.id, childProps.step)
  return (
    <>
      {step == 1 && <ApplicationStep1 {...childProps} />}
      {step == 2 && <ApplicationStep2 {...childProps} />}
    </>
  );
}
