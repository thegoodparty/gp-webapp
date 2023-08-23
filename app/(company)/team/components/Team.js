'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './Team.module.scss';

export const TEAM_MEMBERS = [
  {
    name: 'Farhad Mohit',
    role: 'Founder',
    img: 'https://assets.goodparty.org/team/farhad-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/farhad-party.jpg',
    partyRole: 'Burner',
  },
  {
    name: 'Žak Tomich',
    role: 'Chief Executive Officer',
    img: 'https://assets.goodparty.org/team/zak-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/zak-party.jpg',
    partyRole: 'Dad Joker',
  },
  {
    name: 'Victoria Mitchell',
    role: 'Chief Operating Officer',
    img: 'https://assets.goodparty.org/team/victoria-goodparty.jpg',
    flipImg: 'https://assets.goodparty.org/team/victoria-party.jpg',
    partyRole: 'Responsibly Wild Wanderer',
  },
  {
    name: 'Tomer Almog',
    role: 'Chief Technology Officer',
    img: 'https://assets.goodparty.org/team/tomer-gp2.jpg',
    flipImg: 'https://assets.goodparty.org/team/tomer-party.jpg',
    partyRole: 'Peaceful Warrior',
  },
  {
    name: 'Rob Booth',
    role: 'Head of Field and Mobilization',
    img: 'https://assets.goodparty.org/team/rob-goodparty.jpg',
    flipImg: 'https://assets.goodparty.org/team/rob-party.jpg',
    partyRole: 'Rockstar',
  },
  {
    name: 'Jared Alper',
    role: 'Political Director',
    img: 'https://assets.goodparty.org/team/jared-goodparty.jpg',
    flipImg: 'https://assets.goodparty.org/team/jared-party.jpg',
    partyRole: 'Improviser',
  },
  {
    name: 'Mateo Wardenaar',
    role: 'Director of Product Management',
    img: 'https://assets.goodparty.org/team/matthew-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/matthew-party.jpg',
    partyRole: 'Social Storyteller',
  },

  {
    name: 'Jack Nagel',
    role: 'Marketing Manager',
    img: 'https://assets.goodparty.org/team/jack-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/jack-party.png',
    partyRole: 'Curious Plant Dad',
  },
  {
    name: 'Martha Gakunju',
    role: 'People & Culture Coordinator',
    img: 'https://assets.goodparty.org/team/martha-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/martha-party.jpg',
    partyRole: 'Safari-er',
  },
  {
    name: 'Taylor Murray',
    role: 'Senior Fullstack Developer',
    img: 'https://assets.goodparty.org/team/taylor-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/taylor-party.png',
    partyRole: 'Good Vibes',
  },

  {
    name: 'Gabby Coll',
    role: 'Jr. Product Designer',
    img: 'https://assets.goodparty.org/team/gabby-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/gabby-party.jpg',
    partyRole: 'Community+based curator+creative',
  },

  {
    name: 'Colton Hess',
    role: 'Creator Community Lead',
    img: 'https://assets.goodparty.org/team/colton-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/colton-party.jpg',
    partyRole: 'Radical Generalist',
  },

  {
    name: 'Quinn McCully',
    role: 'Community Manager',
    img: 'https://assets.goodparty.org/team/quinn-goodparty.jpg',
    flipImg: 'https://assets.goodparty.org/team/quinn-party.jpg',
    partyRole: 'Community Manager',
  },
  {
    name: 'Evan Scronce',
    role: 'Design Contributor',
    img: 'https://assets.goodparty.org/team/evan-goodparty.png',
    flipImg: 'https://assets.goodparty.org/team/evan-party.png',
    partyRole: 'Dad',
  },
];

export default function Team() {
  const [selected, setSelected] = useState({});
  const [flipAll, setFlipAll] = useState(false);

  const handleSelected = (index) => {
    console.log('selected index', index);
    setSelected({
      ...selected,
      [index]: !selected[index],
    });
  };

  const handleFlipAll = () => {
    const all = {};
    TEAM_MEMBERS.forEach((member, index) => {
      all[index] = !flipAll;
    });
    setSelected(all);
    setFlipAll(!flipAll);
  };

  return (
    <section>
      <div
        className="text-center mb-6 font-bold text-xl cursor-pointer underline"
        onClick={handleFlipAll}
        data-cy="team-section-tap"
      >
        Tap to see our {flipAll ? 'Good' : 'Party'} side!
      </div>
      <div className={flipAll && 'flipped'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {TEAM_MEMBERS.map((member, index) => (
            <div
              className={`cursor-pointer mb-2 p-2 lg:mb-6 ${styles.member} ${
                selected[index] ? 'selected' : 'not-selected'
              }`}
              onClick={() => handleSelected(index)}
              key={member.name}
            >
              <div
                className={`relative w-full h-full member-inner ${styles.inner}`}
              >
                <div className={`absolute w-full h-full ${styles.front}`}>
                  <Image
                    className="block mb-3 w-full h-auto"
                    src={member.img}
                    alt={member.name}
                    width={500}
                    height={500}
                    data-cy="member-avatar"
                  />
                  <div
                    className="font-bold mt-2 mb-3 text-2xl"
                    data-cy="member-name"
                  >
                    {member.name}
                  </div>
                  <div className="" data-cy="member-role">
                    {member.role}
                  </div>
                </div>
                <div className={`absolute w-full h-full ${styles.back}`}>
                  <Image
                    className="block mb-3 w-full h-auto"
                    src={member.flipImg}
                    alt={member.name}
                    width={500}
                    height={500}
                    data-cy="member-flip-avatar"
                  />
                  <div
                    className="font-bold mt-2 mb-3 text-2xl"
                    data-cy="member-name"
                  >
                    {member.name}
                  </div>
                  <div className="" data-cy="member-role">
                    {member.partyRole}
                  </div>
                </div>
              </div>
              <div className="hide">
                <Image
                  className="block mb-3 w-full h-auto"
                  src={member.img}
                  alt={member.name}
                  width={500}
                  height={500}
                  data-cy="member-avatar"
                />
                <div
                  className="font-bold mt-2 mb-3 text-2xl"
                  data-cy="member-name"
                >
                  {member.name}
                </div>
                <div className=" " data-cy="member-role">
                  {member.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
