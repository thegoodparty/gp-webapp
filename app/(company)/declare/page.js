import pageMetaData from 'helpers/metadataHelper';
import DeclagePage from './components/DeclarePage';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { Libre_Baskerville, Tangerine } from '@next/font/google';

const baskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const tangerine = Tangerine({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const fetchSignatures = async () => {
  try {
    const api = gpApi.homepage.declarationSignatures.list;
    const signers = await gpFetch(api);
    return signers?.signatures || '';
  } catch (e) {
    console.log('error at fetchSignatures', e);
    return {};
  }
};

const meta = pageMetaData({
  title: 'Declaration of Independence | GOOD PARTY',
  description:
    'Help us make history by signing the GOOD PARTY Declaration of Independence.',
  slug: '/declare',
  image: 'https://assets.goodparty.org/signature.png',
});
export const metadata = meta;

export default async function Page(params) {
  const signatures = await fetchSignatures();
  const childProps = {
    signatures,
    baskerville,
    tangerine,
  };

  return <DeclagePage {...childProps} />;
}
