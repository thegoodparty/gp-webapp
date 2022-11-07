import Image from 'next/image';
import heartImg from '/public/images/heart.svg';
import Ticker from './Ticker';

// import Ticker from './Ticker';

const SocialSection = () => {
  return (
    <div className="mb-5 lg:mt-24">
      <div className="flex items-center">
        <div className="mr-3 pt-2">
          <Image
            src={heartImg}
            width="42"
            height="34"
            alt="good party"
            data-cy="heart-icon"
            priority
          />
        </div>
        <div data-cy="people-count" className="text-3xl font-black lg:text-5xl">
          <Ticker cookieName="ticker-people" />
        </div>
        <div
          className="ml-7 font-black lg:text-3xl"
          data-cy="people-count-label"
        >
          @goodparty people
        </div>
      </div>
    </div>
  );
};

export default SocialSection;
