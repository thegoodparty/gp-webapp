import pageMetaData from 'helpers/metadataHelper';
import DeclagePage from './components/DeclarePage';

const meta = pageMetaData({
  title: 'Declaration of Independence | GOOD PARTY',
  description:
    'Help us make history by signing the GOOD PARTY Declaration of Independence.',
  slug: '/declare',
  image: 'https://assets.goodparty.org/signature.png',
});
export const metadata = meta;

export default async function Page() {
  return <DeclagePage />;
}
