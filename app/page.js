import pageMetaData from 'helpers/metadataHelper';
import './globals.css';
import HomePage from './homepage/HomePage';

export const revalidate = 3600;
export const dynamic = 'force-static';

const meta = pageMetaData({
  title: 'GoodParty.org | Empowering independents to run, win and serve.',
  description:
    "We're transforming civic leadership with tools and data that empower independents to run, win and serve without needing partisan or big-money support. Join Us!",
  slug: '/',
});

export const metadata = meta;

export default async function Page() {
  return <HomePage />;
}
