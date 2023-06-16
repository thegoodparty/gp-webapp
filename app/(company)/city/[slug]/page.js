import { notFound, redirect } from 'next/navigation';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import CityPage from './components/CityPage';
import pageMetaData from 'helpers/metadataHelper';
// import CitySchema from './CitySchema';

export const fetchCity = async (slug) => {
  try {
    const api = gpApi.city.find;
    const payload = {
      slug,
      allFields: true,
    };
    return await gpFetch(api, payload, 3600);
  } catch (e) {
    return false;
  }
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  //   const { city } = await fetchCity(slug);
  //   if (!city) {
  //     const meta = pageMetaData({
  //       title: 'Not Found',
  //       description: '',
  //       slug: `/city/${slug}`,
  //     });
  //     return meta;
  //   }

  //   const { name, heroTitle, heroSubTitle, heroButton1Text, heroButton2Text, heroImage } = city;
  // TODO: rework title/description with downloaded city content.
  const title = 'City Landing Page';
  const description = `City Landing Page`;

  const meta = pageMetaData({
    title,
    description,
    slug: `/city/${slug}`,
    // image,
  });
  return meta;
}

export default async function Page({ params }) {
  const { slug } = params;

  const city = {
    name: 'City Name',
    heroTitle: 'City Hero Title',
    heroSubTitle: 'City Hero Sub Title',
    heroButton1Text: 'City Hero Button 1 Text',
    heroButton2Text: 'City Hero Button 2 Text',
    heroImage: '/images/city/nashville-hero.png',
  };

  //   const { city } = await fetchCandidate(slug);
  if (!city) {
    notFound();
  }

  const childProps = {
    city,
  };

  return (
    <>
      <CityPage {...childProps} />
    </>
  );
}
