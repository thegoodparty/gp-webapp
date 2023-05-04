import { Suspense } from 'react';
import MaxWidth from '@shared/layouts/MaxWidth';
import HubSpotForm from '../../shared/utils/HubSpotForm';
import pageMetaData from 'helpers/metadataHelper';
import Image from 'next/image';
import { Libre_Baskerville } from '@next/font/google';
import BaseButtonClient from '../../shared/buttons/BaseButtonClient';

const baskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const meta = pageMetaData({
  title: 'Declaration of Independence | GOOD PARTY',
  description:
    'Help us make history by signing the GOOD PARTY Declaration of Independence.',
  slug: '/declare',
});
export const metadata = meta;

export default function Page() {
  return (
    <MaxWidth>
      <div className="xl:max-w-5xl mx-auto w-full items-center">
        <div className="flex flex-col mt-12 mb-12">
          <div>
            <div class="flex justify-center items-center mx-auto mb-6">
              <Image
                src="/images/heart.svg"
                width={56}
                height={56}
                className="mr-3"
              />
              <p class="text-4xl font-bold">
                GOOD PARTY Declaration of Independence
              </p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className={`md:w-[75%] text-sm ${baskerville.className}`}>
                When in the course of human events it becomes necessary for
                people to have a Good Party, we need to ditch the two-party
                system. We hold these truths to be self-evident, that the
                political duopoly sucks, and that we truly deserve real
                Independent choices on the ballot. That we are endowed with
                certain unalienable rights to political representatives who are
                Honest, Independent, and People-Powered.
              </div>
              <div
                className={`md:w-[75%] mt-5 text-sm ${baskerville.className}`}
              >
                The history of the two-party system is a history of bad vibes
                and worse choices, all having in direct object the establishment
                of an absolute Tyranny over these States. To prove this, let
                Facts be submitted to a candid world:
              </div>
              <div
                className={`md:w-[65%] border-yellow-400 p-2 border-l-4 mt-5 font-italic text-sm ${baskerville.className}`}
              >
                In the last Presidential election, 74 million voted for Trump,
                81 million voted for Biden, but a whopping 83 million did not
                vote at all.
              </div>
              <div
                className={`md:w-[65%] border-yellow-400 p-2 border-l-4 mt-5 font-italic text-sm ${baskerville.className}`}
              >
                Our elected officials spend up to 70% of their time in office
                fundraising for the next election. When they&apos;re not
                fundraising, they have no choice but to make sure the laws they
                pass keep their major donors happy – or they won&apos;t be able
                to run in the next election.
              </div>
              <div
                className={`md:w-[65%] border-yellow-400 p-2 border-l-4 mt-5 font-italic text-sm ${baskerville.className}`}
              >
                Congress has a 20% approval rating, but our districts are so
                gerrymandered the same unpopular politicians keep getting
                re-elected. The only way to fix this is to pay attention to
                local races and pass better redistricting laws in the states.
              </div>
              <div
                className={`md:w-[65%] border-yellow-400 p-2 border-l-4 mt-5 font-italic text-sm ${baskerville.className}`}
              >
                And worst of all, politicians have made Party a dirty word.
              </div>
              <div
                className={`md:w-[75%] mt-5 text-sm ${baskerville.className}`}
              >
                It&apos;s no wonder that a majority of eligible voters (over
                130M Americans), including more than half of Millennials and Gen
                Z, say that neither Republicans, nor Democrats represent them.
                It&apos;s time to declare independence from the corrupt
                two-party system.
              </div>
            </div>
            <div className="flex flex-row md:w-[75%] justify-center items-center align-middle">
              <div className="flex flex-col font-bold text-xl justify-start">
                3,134 People have signed
              </div>
              <div>
                <BaseButtonClient
                  className="py-3 px-4 mb-3 ml-3 font-bold bg-pink-600 text-white text-sm"
                  style={{
                    borderRadius: '9999px',
                    padding: '0.625rem 1.25rem',
                  }}
                >
                  SIGN NOW
                </BaseButtonClient>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidth>
  );
}
