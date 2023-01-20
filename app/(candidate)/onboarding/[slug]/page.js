import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import PledgePage from './components/PledgePage';

export default async function Page({ params }) {
  const { slug } = params;

  const childProps = {
    self: `/onboarding/${slug}`,
    title: 'Take the pledge',
    description:
      'You must accept the Good Party Pledge to be a candidate on our site.',
    slug,
  };
  return <PledgePage {...childProps} />;
}
