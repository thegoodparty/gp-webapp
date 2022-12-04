import GoalsChart from '@shared/candidates/GoalsChart';
import FaqLink from '@shared/content/FaqLink';
import { dateUsHelper } from 'helpers/dateHelper';
import { numberFormatter } from 'helpers/numberHelper';
import { Suspense } from 'react';
import { CONTACT_EMAIL } from 'utils/constants';
import PortalPanel from '../shared/PortalPanel';

export default function VoterProjection({ candidate }) {
  const today = new Date();
  const { votesNeeded, likelyVoters, unrepVoters } = candidate;
  const votersX =
    unrepVoters && votesNeeded && votesNeeded !== 0
      ? Math.round((unrepVoters * 100) / votesNeeded) / 100 // to add decimal if needed
      : 1;
  return (
    <PortalPanel color="#422CCD">
      <h3 className="text-2xl font-black mb-12" data-cy="goals-title">
        Voter Projections{' '}
        <span className="font-normal text-lg">
          (as of {dateUsHelper(today)}{' '}
          {today.toLocaleTimeString().replace(/(.*)\D\d+/, '$1')})
        </span>
      </h3>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6">
              <div className="font-bold mb-3" data-cy="votes-need-win">
                VOTES NEEDED TO WIN 🎉
              </div>
              <span className="mr-3 text-zinc-600" data-cy="votes-need-win-val">
                {numberFormatter(votesNeeded || 0)}
              </span>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="font-bold mb-3" data-cy="votes-so-far">
                LIKELY VOTES SO FAR 🗳
              </div>
              <span className="mr-3 text-zinc-600" data-cy="votes-so-far-val">
                {numberFormatter(likelyVoters || 0)}
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <Suspense fallback="loading">
            <GoalsChart candidate={candidate} />
          </Suspense>
        </div>

        <div className="col-span-12 lg:col-span-6" data-cy="goals-description">
          Good Party projects <strong>{numberFormatter(unrepVoters)}</strong>{' '}
          voters are not going to vote Red or Blue in this race. That means{' '}
          <strong>{votersX}x</strong> the number of votes needed to win are
          available for a good independent or 3rd party candidate in this race!
        </div>
        <div className="col-span-12 lg:col-span-6"> &nbsp;</div>
        <div className="col-span-12 lg:col-span-6">
          <FaqLink articleId="4KOzae6PB45c9GQY9Xi9UX">
            <div
              className="underline text-neutral-500"
              data-cy="methodology-link"
            >
              Methodology
            </div>
          </FaqLink>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="flex lg:justify-end">
            <div data-cy="have-question">
              Have a question?
              <br />
              <a
                className="underline text-neutral-500"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                Ask us
              </a>
            </div>
          </div>
        </div>
      </div>
    </PortalPanel>
  );
}
