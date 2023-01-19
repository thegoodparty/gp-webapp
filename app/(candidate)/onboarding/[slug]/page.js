import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import GoalsPage from './components/GoalsPage';

export default async function Page({ params }) {
  const { slug } = params;

  const childProps = {
    self: `/onboarding/${slug}`,
    title: 'Goals and Objectives',
    description:
      'Good Party  will be with you every step of the way so you can run a successful campaign.',
  };
  return <GoalsPage {...childProps} />;
}
