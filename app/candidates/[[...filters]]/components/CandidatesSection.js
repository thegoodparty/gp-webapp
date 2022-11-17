import React, { Suspense } from 'react';

import FaqLink from '@shared/utils/FaqLink';
import Image from 'next/image';
import LargeCard from '@shared/candidates/LargeCard';

export default function CandidatesSection({ candidates }) {
  return (
    <section className="mt-20 ">
      <div className="grid grid-cols-1 lg:grid-cols2">
        <div>
          <h2
            className="text-xl font-black lg:mb-5"
            data-cy="candidates-section-title"
          >
            Top Trending Candidates
          </h2>
        </div>
        <div className="underline mb-6 lg:text-right">
          <FaqLink articleId="5zIbKVU0wCIAszTOyogGAB">
            What is{' '}
            <Image
              className="mx-1 inline-block"
              src="/images/heart.svg"
              alt="GP"
              width={14}
              height={11}
            />{' '}
            GOOD CERTIFIED?
          </FaqLink>
        </div>
      </div>
      {(candidates || []).map((candidate) => (
        <React.Fragment key={candidate.id}>
          {/* {((showOnlyGood && candidate.isClaimed) || !showOnlyGood) && ( */}
          <Suspense>
            <LargeCard candidate={candidate} />
          </Suspense>
          {/* )} */}
        </React.Fragment>
      ))}
      {(!candidates || candidates.length === 0) && (
        <div className="text-center">
          <FontH3>No Results match your filters</FontH3>
          <br />
          <Link href="/candidates">Remove all filters</Link>
        </div>
      )}
    </section>
  );
}
