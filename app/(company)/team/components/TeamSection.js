'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './Team.module.scss';

export default function TeamSection(props) {
  const { TEAM_MEMBERS, title } = props;
  const [selected, setSelected] = useState({});
  const [flipAll, setFlipAll] = useState(false);

  const handleSelected = (index) => setSelected({
    ...selected,
    [index]: !selected[index],
  });

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
      <h2
        className="text-2xl font-black my-10"
        data-cy="volunteer-section-title"
      >
        {title}
      </h2>
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
