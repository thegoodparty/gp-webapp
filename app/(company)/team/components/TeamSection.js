'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './Team.module.scss';

export default function TeamSection(props) {
  const {title, teamMembers } = props;
  console.log(`teamMembers WTF?? =>`, teamMembers)
  const [selected, setSelected] = useState({});
  const [flipAll, setFlipAll] = useState(false);

  const handleSelected = (index) => setSelected({
    ...selected,
    [index]: !selected[index],
  });

  const handleFlipAll = () => {
    const all = {};
    teamMembers.forEach((member, index) => {
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
      <div {...{
        ...(flipAll ? { className: 'flipped' } : {})
      }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {teamMembers?.map(({
            id,
            fullName,
            role,
            partyRole,
            goodPhoto: { url: goodPhotoUrl, alt: goodAlt } = {},
            partyPhoto: { url: partyPhotoUrl, alt: partyAlt } = {},
          }, index) => (
            <div
              className={`cursor-pointer mb-2 p-2 lg:mb-6 ${styles.member} ${
                selected[index] ? 'selected' : 'not-selected'
              }`}
              onClick={() => handleSelected(index)}
              key={id}
            >
              <div
                className={`relative w-full h-full member-inner ${styles.inner}`}
              >
                <div className={`absolute w-full h-full ${styles.front}`}>
                  <Image
                    className="block mb-3 w-full h-auto"
                    src={`https:${goodPhotoUrl}`}
                    alt={goodAlt}
                    width={500}
                    height={500}
                    data-cy="member-avatar"
                  />
                  <div
                    className="font-bold mt-2 mb-3 text-2xl"
                    data-cy="member-name"
                  >
                    {fullName}
                  </div>
                  <div className="" data-cy="member-role">
                    {role}
                  </div>
                </div>
                <div className={`absolute w-full h-full ${styles.back}`}>
                  <Image
                    className="block mb-3 w-full h-auto"
                    src={`https:${partyPhotoUrl}`}
                    alt={partyAlt}
                    width={500}
                    height={500}
                    data-cy="member-flip-avatar"
                  />
                  <div
                    className="font-bold mt-2 mb-3 text-2xl"
                    data-cy="member-name"
                  >
                    {fullName}
                  </div>
                  <div className="" data-cy="member-role">
                    {partyRole}
                  </div>
                </div>
              </div>
              <div className="hide">
                <Image
                  className="block mb-3 w-full h-auto"
                  src={`https:${goodPhotoUrl}`}
                  alt={goodAlt}
                  width={500}
                  height={500}
                  data-cy="member-avatar"
                />
                <div
                  className="font-bold mt-2 mb-3 text-2xl"
                  data-cy="member-name"
                >
                  {fullName}
                </div>
                <div className=" " data-cy="member-role">
                  {role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
