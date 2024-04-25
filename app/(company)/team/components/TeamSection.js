'use client';
import { useState } from 'react';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import { TeamMemberCards } from 'app/(company)/team/components/TeamMemberCards';
import Image from 'next/image';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Link from 'next/link';

export default function TeamSection(props) {
  const { teamMembers, teamMilestones } = props;
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
      <div className="px-4 py-8">
        <h2
          className="text-4xl font-medium leading-tight mb-4"
          data-cy="volunteer-section-title"
        >
          Meet the team
        </h2>
        <p className="font-sfpro mb-8">
          Our full-time team is building the tools and infrastructure powering
          the movement. We come from a diverse range of backgrounds and
          political persuasions, all united by the mission to make people matter
          more than money in our democracy.
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
        <div className="border-2 bg-white p-8 rounded-3xl">
          <Image
            className="mb-4"
            src="/images/logo-hologram-white.svg"
            width={48}
            height={60}
            alt="GoodParty Logo"
            priority
          />
          <h3 className="text-2xl mb-1">Interested in joining our team?</h3>
          <p className="font-sfpro mb-8">We’re always looking for new talent ready to create change.</p>
          <Link href="/work-with-us">
            <PrimaryButton>View open positions</PrimaryButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
