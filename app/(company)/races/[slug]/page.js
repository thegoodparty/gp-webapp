import { notFound, redirect } from 'next/navigation';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import RacePage from './components/RacePage';
import pageMetaData from 'helpers/metadataHelper';
// import RaceSchema from './RaceSchema';

export const fetchRace = async (slug) => {
  try {
    const api = gpApi.races.find;
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
  //   const { race } = await fetchRace(slug);
  //   if (!race) {
  //     const meta = pageMetaData({
  //       title: 'Not Found',
  //       description: '',
  //       slug: `/races/${slug}`,
  //     });
  //     return meta;
  //   }

  const title = 'Race Landing Page';
  const description = `Race Landing Page`;
  const meta = pageMetaData({
    title,
    description,
    slug: `/races/${slug}`,
    // image,
  });
  return meta;
}

export default async function Page({ params }) {
  const { slug } = params;

  const race = {
    name: 'Nashville',
    heroTitle: 'Welcome to the party Nashville',
    heroSubTitle:
      'Something here thats interesting and great and wow things here and more wow things great content here things great',
    heroButton1Text: 'Meet your candidates',
    heroButton1Link: 'https://www.google.com',
    heroButton2Text: 'A video?',
    heroButton2Link: 'https://www.google.com',
    heroImage: '/images/races/nashville-hero.png',
    skylineImage: '/images/races/skyline.png',
    candidatesTitle: 'Your candidates',
    candidatesSubTitle:
      'Something here thats interesting and great and wow things here and more wow things great content here things great',
    candidates: [
      {
        slug: 'candidate-1',
      },
      {
        slug: 'candidate-2',
      },
      {
        slug: 'candidate-3',
      },
      {
        slug: 'candidate-4',
      },
    ],
    articles: [
      {
        slug: 'article-1',
        id: 'artcle1',
        title: 'Tomer smashes developer record',
        mainImage: {
          url: 'https://assets.goodparty.org/team/tomer-goodparty.png',
          alt: 'alt text',
        },
        summary:
          'Something here thats interesting and great and wow things here and more wow things great content here things great',
      },
      {
        slug: 'article-2',
        id: 'artcle2',
        title: 'Another Interesting title here',
        mainImage: {
          url: 'https://assets.goodparty.org/team/tomer-goodparty.png',
          alt: 'alt text',
        },
        summary:
          'Something here thats interesting and great and wow things here and more wow things great content here things great',
      },
      {
        slug: 'article-3',
        id: 'artcle3',
        title: 'Tomer eats giant pizza in one bite.',
        mainImage: {
          url: 'https://assets.goodparty.org/team/tomer-goodparty.png',
          alt: 'alt text',
        },
        summary:
          'Something here thats interesting and great and wow things here and more wow things great content here things great',
      },
    ],
  };

  //   const { race } = await fetchRace(slug);
  if (!race) {
    notFound();
  }

  const childProps = {
    race,
  };

  return (
    <>
      <RacePage {...childProps} />
    </>
  );
}
