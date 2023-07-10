import pageMetaData from 'helpers/metadataHelper';
import DeclarePage from './components/DeclarePage';
import { Libre_Baskerville, Tangerine } from 'next/font/google';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

const baskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const tangerine = Tangerine({
  weight: ['400', '700'],
  subsets: ['latin'],
});

async function fetchSignatures() {
  try {
    const api = gpApi.homepage.declarationSignatures.list;
    return await gpFetch(api);
  } catch (e) {
    console.log('error at fetchSignatures', e);
    return {};
  }
}

const meta = pageMetaData({
  title: 'Declaration of Independence | GOOD PARTY',
  description:
    'Help us make history by signing the GOOD PARTY Declaration of Independence.',
  slug: '/declare',
  image: 'https://assets.goodparty.org/signature.png',
});
export const metadata = meta;

export default async function Page(params) {
  const { signatures } = await fetchSignatures();
  const childProps = {
    signatures: signatures || '',
    baskerville,
    tangerine,
  };

  return <DeclarePage {...childProps} />;
}
