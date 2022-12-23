import React from 'react';
import Link from 'next/link';
import gpApi from '../../gpApi';
import gpFetch from '../../gpApi/gpFetch';
import CandidateCard from '@shared/candidates/CandidateCard';
import FaqLink from '@shared/content/FaqLink';

async function fetchHomepageCandidates() {
  return await gpFetch(gpApi.homepage.homepageCandidates, false, 3600);
}

async function CandidatesSection() {
  const { homepageCandidates } = await fetchHomepageCandidates();
  return (
    <div className="pt-11 pb-14 lg:pt-14 ">
      <h2
        data-cy="home-candidates-title"
        className="text-xl font-normal mb-5 lg:text-2xl lg:mt-28 lg:mb-7"
      >
        Find{' '}
        <FaqLink articleId="5zIbKVU0wCIAszTOyogGAB">
          Good Party Certified
        </FaqLink>{' '}
        candidates who pledge to be{' '}
        <strong>Independent, People Powered and Anti-Corruption</strong>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-8">
        {homepageCandidates.map((candidate) => (
          <React.Fragment key={candidate.id}>
            <CandidateCard candidate={candidate} />
          </React.Fragment>
        ))}
      </div>
      <div className="text-center mt-12 text-2xl font-black underline lg:mt-20 lg:mb-40">
        <Link
          href="/candidates"
          id="see-more-candidates"
          data-cy="see-more-link"
        >
          See More Candidates
        </Link>
      </div>
    </div>
  );
}

export default CandidatesSection;
