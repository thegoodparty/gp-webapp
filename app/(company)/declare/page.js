import pageMetaData from 'helpers/metadataHelper';
import DeclarePage from './components/DeclarePage';
import { Libre_Baskerville, Tangerine } from 'next/font/google';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

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
    const resp = await serverFetch(
      apiRoutes.homepage.declarationSignatures.list,
    );
    return resp.data;
  } catch (e) {
    console.log('error at fetchSignatures', e);
    return {};
  }
}

const meta = pageMetaData({
  title: 'Declaration of Independence | GoodParty.org',
  description:
    'Help us make history by signing the GoodParty.org Declaration of Independence.',
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
