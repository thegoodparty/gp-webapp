import pageMetaData from 'helpers/metadataHelper';
import './globals.css';
import HomePage from './homepage/HomePage';

const meta = pageMetaData({
  title: 'GOOD PARTY | Free tools to change the rules and disrupt the corrupt.',
  description:
    "Not a political party, we're building tools to change the rules, empowering creatives to mobilize community & disrupt the corrupt two-party system. Join us!",
  slug: '/',
});

export const metadata = meta;

export default function Page() {
  return <HomePage />;
}
