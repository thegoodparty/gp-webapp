import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import peopleImg from 'public/images/landing-pages/discord-people.png';
import ballotBoxImg from 'public/images/landing-pages/ballot-box.png';
import CTA from './CTA';
import WarningButton from '@shared/buttons/WarningButton';

export default function JoinDiscord() {
  return (
    <section className="bg-primary text-gray-50 py-20">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-6">
            <h2 className="text-6xl md:text-8xl font-semibold">
              Join our Discord now
            </h2>
            <h3 className="text-2xl font-semibold mt-10">
              The community for independents
            </h3>
            <div className="text-lg font-sfpro mt-2 mb-4">
              Eager to dive right in, come join our Discord now and engage in
              our lively online community.
            </div>
            <Image
              src={peopleImg}
              alt="discord"
              width={352}
              height={64}
              className="mb-10"
            />
            <a
              href="https://join.goodparty.org/discord-signup"
              id="cta-discord"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <WarningButton>Join our Discord</WarningButton>
            </a>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="md:px-10">
              <Image src={ballotBoxImg} alt="discord" className="mb-10" />
            </div>
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}
