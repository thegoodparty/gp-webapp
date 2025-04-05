import styles from 'app/(company)/team/components/Team.module.scss'
import { TeamMemberCard } from 'app/(company)/team/components/TeamMemberCard'

export const TeamMemberCards = ({
  teamMembers,
  flipAll,
  selected,
  handleSelected,
}) => {
  return (
    <div className={`mb-8${flipAll ? ' flipped' : ''}`}>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 max-w-[640px] xl:max-w-full mx-auto">
        {teamMembers?.map(
          (
            {
              id,
              fullName,
              role,
              partyRole,
              goodPhoto: { url: goodPhotoUrl, alt: goodAlt } = {},
              partyPhoto: { url: partyPhotoUrl, alt: partyAlt } = {},
            },
            index,
          ) => (
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
                  <TeamMemberCard
                    fullName={fullName}
                    role={role}
                    src={`https:${goodPhotoUrl}`}
                    alt={goodAlt}
                  />
                </div>
                <div className={`absolute w-full h-full ${styles.back}`}>
                  <TeamMemberCard
                    fullName={fullName}
                    role={partyRole}
                    src={`https:${partyPhotoUrl}`}
                    alt={partyAlt}
                  />
                </div>
              </div>
              <div className="hide">
                <TeamMemberCard
                  fullName={fullName}
                  role={role}
                  src={`https:${goodPhotoUrl}`}
                  alt={goodAlt}
                />
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
