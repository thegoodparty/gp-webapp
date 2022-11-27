/**
 *
 * CandidatesSection
 *
 */

import React from 'react';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';
import Link from 'next/link';
import CandidateCard from '@shared/candidates/CandidateCard';
import { getServerToken } from 'helpers/userServerHelper';

async function fetchCandidates(params) {
  const api = gpApi.user.follow.list;
  api.url = `${api.url}?withCandidates=true`;
  const token = getServerToken();
  console.log('token', token);
  return await gpFetch(api, false, 3600, token);
}

async function CandidatesSection() {
  const { candidates } = await fetchCandidates();

  return (
    <div className="mt-6">
      <div className="grid grid-cols-12 gap-3">
        {candidates && (
          <>
            {candidates.map((candidate) => (
              <div
                className="col-span-12 md:col-span-6 lg:col-span-4"
                key={candidate?.id}
                data-cy="candidate-card"
              >
                <CandidateCard candidate={candidate} withFollowButton />
              </div>
            ))}
          </>
        )}
      </div>
      {(!candidates || candidates?.length === 0) && (
        <div className="text-center">
          <h3 className="text-xl tracking-wide font-black">
            You are not following any candidates yet.
          </h3>
          <br />
          <Link href="/candidates">Find Candidates</Link>
        </div>
      )}
    </div>
  );
}

export default CandidatesSection;
