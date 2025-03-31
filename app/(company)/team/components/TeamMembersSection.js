'use client';
import { useState } from 'react';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import { TeamMemberCards } from 'app/(company)/team/components/TeamMemberCards';
import Image from 'next/image';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Link from 'next/link';
import MaxWidth from '@shared/layouts/MaxWidth';

export default function TeamMembersSection(props) {
  const { teamMembers } = props;
  const [selected, setSelected] = useState({});
  const [flipAll, setFlipAll] = useState(false);

  const handleSelected = (index) =>
    setSelected({
      ...selected,
      [index]: !selected[index],
    });

  const handleFlipAll = (e) => {
    e.preventDefault();
    const all = {};
    teamMembers.forEach((member, index) => {
      all[index] = !flipAll;
    });
    setSelected(all);
    setFlipAll(!flipAll);
  };

  return (
    <section className="bg-primary-background">
      <MaxWidth>
        <div className="py-8 lg:py-24">
          <h2
            className="text-4xl font-medium leading-tight mb-4 lg:text-6xl leading-snug"
            data-cy="volunteer-section-title"
          >
            Meet the team
          </h2>
          <p className="font-sfpro mb-8 lg:text-2xl lg:leading-snug text-gray-600 font-medium">
            Our full-time team is building the tools and infrastructure powering
            the movement. We come from a diverse range of backgrounds and
            political persuasions, all united by the mission to make people
            matter more than money in our democracy.
          </p>
          <SecondaryButton
            className="block text-center border-none mb-6 font-light text-small cursor-pointer w-full mx-auto md:w-auto"
            onClick={handleFlipAll}
            data-cy="team-section-tap"
          >
            Tap to see our {flipAll ? 'Good' : 'Party'} side!
          </SecondaryButton>
          <TeamMemberCards
            teamMembers={teamMembers}
            flipAll={flipAll}
            selected={selected}
            handleSelected={handleSelected}
          />
          <div className="border-2 bg-white p-8 rounded-3xl grid grid-cols-10 gap-4 items-center">
            <div className="col-span-12 lg:col-span-1 h-[48px] w-[60px] lg:h-auto lg:w-auto">
              <Image
                className="mb-4 lg:my-auto w-full"
                src="/images/logo/heart.svg"
                width={60}
                height={48}
                alt="GoodParty Logo"
                priority
              />
            </div>
            <div className="col-span-12 lg:col-span-5">
              <h3 className="text-2xl mb-1">Interested in joining our team?</h3>
              <p className="font-sfpro mb-8 lg:mb-auto">
                We’re always looking for new talent ready to create change.
              </p>
            </div>
            <Link className="col-span-12 lg:col-span-4" href="/work-with-us">
              <PrimaryButton className="w-full">
                View open positions
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}
