/**
 *
 * StaffCard
 *
 */

import React from 'react';
import Image from 'next/image';
import { partyResolver } from 'helpers/candidateHelper';
import Link from 'next/link';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';

function StaffCard({ candidate, role }) {
  if (!candidate) {
    return <></>;
  }

  const { id, firstName, lastName, image, race, party, otherParty } = candidate;
  return (
    <Link
      href={`/candidate-portal/${id}`}
      className="h-full no-underline"
      legacyBehavior
      passHref
      data-cy="staff-link"
    >
      <div
        className="text-center p-2 bg-zinc-100 rounded-tr-2xl rounded-tl-2xl capitalize"
        data-cy="staff-role"
      >
        <strong>Your Role: </strong>Campaign {role}
      </div>
      <div
        className="rounded-tr-2xl rounded-tl-2xl px-4 pt-4 pb-24 border-2 border-solid border-gray-200 text-black h-full relative bg-white"
        style={{ boxShadow: '0 20px 20px -10px #a3a5ae' }}
      >
        <div className="relative h-64">
          {(image || JSON.parse(candidate.data).image) && (
            <Image
              src={image || JSON.parse(candidate.data).image}
              layout="fill"
              alt={`${firstName} ${lastName}`}
              className="object-contain object-center rounded-tl-lg rounded-tr-lg"
            />
          )}
        </div>
        <div className="pt-6 px-2 pb-2">
          <h2
            className="text-[22px] tracking-wide text-xl font-semibold mt-0 mx-0 mb-2"
            data-cy="staff-name"
          >
            {firstName} {lastName}
          </h2>
          <div className="text-neutral-600" data-cy="staff-race">
            {partyResolver(party, otherParty)} {party !== 'I' ? 'Party' : ''}{' '}
            Candidate <br />
            for <strong>{race}</strong>
          </div>
          <br />
          <br />
          <div className="absolute left-6 bottom-6 w-[calc(100%-48px)]">
            <BlackButtonClient
              fullWidth
              style={{ textTransform: 'none', marginTop: '32px' }}
            >
              Manage Campaign
            </BlackButtonClient>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default StaffCard;
