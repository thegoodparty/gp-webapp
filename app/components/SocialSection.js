import Image from 'next/image';
import { gpApi } from '../../gpApi';
import gpFetch from '../../gpApi/gpFetch';
// import heartImg from '/public/images/heart.svg';
import Ticker from './Ticker';

async function fetchFollowers() {
  return await gpFetch(gpApi.homepage.followers, false, 3600);
}

async function SocialSection() {
  const followers = await fetchFollowers();
  return (
    <section className="mb-5 lg:mt-24">
      <div className="flex items-center">
        <div className="mr-3 pt-2">
          <Image
            src="/images/heart.svg"
            width="42"
            height="34"
            alt="good party"
            data-cy="heart-icon"
            priority
          />
        </div>
        <div data-cy="people-count" className="text-3xl font-black lg:text-5xl">
          <Ticker totalFollowers={followers?.total || 0} />
        </div>
        <div
          className="ml-7 font-black lg:text-3xl"
          data-cy="people-count-label"
        >
          @goodparty people
        </div>
      </div>
    </section>
  );
}

export default SocialSection;

export async function generateStaticParams() {
  const res = await gpFetch(gpApi.homepage.followers);
  return res.json();
}
