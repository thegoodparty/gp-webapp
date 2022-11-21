/**
 *
 * CandidatesSection
 *
 */

import React, { useContext } from 'react';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';
import { cookies } from 'next/headers';
import Link from 'next/link';
import CandidateCard from '@shared/candidates/CandidateCard'

async function fetchCandidates(params) {
    const nextCookies = cookies();
    const api = { ...gpApi.follow.list, authToken: nextCookies.get('token').value };
    api.url = `${api.url}?withCandidates=true`;
    return await gpFetch(api, false, 3600);
}
  
async function CandidatesSection() {
    const { candidates } = await fetchCandidates();
    
    return (
        <div className="mt-6">
            <div class="grid grid-cols-12 gap-3">
                {candidates && (
                    <>
                    {candidates.map((candidate) => (
                        <div 
                            class="col-span-12 md:col-span-6 lg:col-span-4" 
                            key={candidate?.id}
                            data-cy="candidate-card"
                        >
                            <CandidateCard candidate={candidate} withFollowButton />
                        </div>
                    ))}
                    </>
                )}
            </div>
            {candidates.length === 0 && (
                <div className="text-center">
                    <h3 className='text-[22px] tracking-wide font-black'>You are not following any candidates yet.</h3>
                    <br />
                    <Link href="/candidates">Find Candidates</Link>
                </div>
            )}
        </div>
    );
 }
 
 export default CandidatesSection;
 