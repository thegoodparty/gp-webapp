import MaxWidth from '@shared/layouts/MaxWidth';
import pageMetaData from 'helpers/metadataHelper';
import Image from 'next/image';
import SignModal from './components/SignModal';
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

const meta = pageMetaData({
  title: 'Declaration of Independence | GOOD PARTY',
  description:
    'Help us make history by signing the GOOD PARTY Declaration of Independence.',
  slug: '/declare',
  image: 'https://assets.goodparty.org/signature.png',
});
export const metadata = meta;

const fetchSignatures = async () => {
  try {
    const api = gpApi.homepage.declarationSignatures.list;
    return await gpFetch(api, false, 3600);
  } catch (e) {
    console.log('error at fetchSignatures', e);
    return {};
  }
};

export default async function Page() {
  const { signatures } = await fetchSignatures();

  return (
    <MaxWidth>
      <div className="xl:max-w-5xl mx-auto w-full items-center">
        <div className="flex flex-col mt-12 mb-12">
          <div>
            <div className="flex flex-row ml-14 md:ml-0 justify-center mx-auto mb-6">
              <Image
                src="/images/heart.svg"
                alt="GP"
                width={56}
                height={56}
                className="mr-3"
              />
              <p className="text-4xl font-bold">
                GOOD PARTY Declaration of Independence
              </p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className={`md:w-[55%] text-sm ${baskerville.className}`}>
                When in the course of human events it becomes necessary for
                people to have a Good Party, we need to ditch the two-party
                system. We hold these truths to be self-evident, that the
                political duopoly sucks, and that we truly deserve real
                Independent choices on the ballot. That we are endowed with
                certain unalienable rights to political representatives who are
                Honest, Independent, and People-Powered.
              </div>
              <div
                className={`md:w-[55%] mt-5 text-sm ${baskerville.className}`}
              >
                The history of the two-party system is a history of bad vibes
                and worse choices, all having in direct object the establishment
                of an absolute Tyranny over these States. To prove this, let
                Facts be submitted to a candid world:
              </div>
              <div
                className={`md:w-[45%] border-yellow-400 p-2 border-l-4 mt-5 font-italic text-sm ${baskerville.className}`}
              >
                In the last Presidential election, 74 million voted for Trump,
                81 million voted for Biden, but a whopping 83 million did not
                vote at all.
              </div>
              <div
                className={`md:w-[45%] border-yellow-400 p-2 border-l-4 mt-5 font-italic text-sm ${baskerville.className}`}
              >
                Our elected officials spend up to 70% of their time in office
                fundraising for the next election. When they&apos;re not
                fundraising, they have no choice but to make sure the laws they
                pass keep their major donors happy – or they won&apos;t be able
                to run in the next election.
              </div>
              <div
                className={`md:w-[45%] border-yellow-400 p-2 border-l-4 mt-5 font-italic text-sm ${baskerville.className}`}
              >
                Congress has a 20% approval rating, but our districts are so
                gerrymandered the same unpopular politicians keep getting
                re-elected. The only way to fix this is to pay attention to
                local races and pass better redistricting laws in the states.
              </div>
              <div
                className={`md:w-[45%] border-yellow-400 p-2 border-l-4 mt-5 font-italic text-sm ${baskerville.className}`}
              >
                And worst of all, politicians have made Party a dirty word.
              </div>
              <div
                className={`md:w-[55%] mt-5 text-sm ${baskerville.className}`}
              >
                It&apos;s no wonder that a majority of eligible voters (over
                130M Americans), including more than half of Millennials and Gen
                Z, say that neither Republicans, nor Democrats represent them.
                It&apos;s time to declare independence from the corrupt
                two-party system.
              </div>
            </div>
            <div className="flex font-bold text-xl max-w-[55%] mx-auto justify-between items-center align-middle mt-10">
              <p>3,134 People have signed 🎉</p>
              <SignModal />
            </div>
            <div
              className={`flex flex-col max-w-[55%] mx-auto justify-center items-center text-2xl ${tangerine.className}`}
            >
              {signatures}
            </div>
          </div>
        </div>
      </div>
    </MaxWidth>
  );
}
