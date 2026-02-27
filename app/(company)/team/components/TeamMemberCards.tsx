import styles from 'app/(company)/team/components/Team.module.scss'
import { TeamMemberCard } from 'app/(company)/team/components/TeamMemberCard'

interface PhotoData {
  url: string
  alt?: string
}

interface TeamMember {
  id: string
  fullName: string
  role: string
  partyRole?: string
  goodPhoto?: PhotoData
  partyPhoto?: PhotoData
}

interface SelectedState {
  [key: number]: boolean
}

interface TeamMemberCardsProps {
  teamMembers?: TeamMember[]
  flipAll: boolean
  selected: SelectedState
  handleSelected: (index: number) => void
}

export const TeamMemberCards = ({
  teamMembers,
  flipAll,
  selected,
  handleSelected,
}: TeamMemberCardsProps): React.JSX.Element => {
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
              goodPhoto: { url: goodPhotoUrl, alt: goodAlt } = {
                url: '',
                alt: '',
              },
              partyPhoto: { url: partyPhotoUrl, alt: partyAlt } = {
                url: '',
                alt: '',
              },
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
                    alt={goodAlt || ''}
                  />
                </div>
                <div className={`absolute w-full h-full ${styles.back}`}>
                  <TeamMemberCard
                    fullName={fullName}
                    role={partyRole || role}
                    src={`https:${partyPhotoUrl}`}
                    alt={partyAlt || ''}
                  />
                </div>
              </div>
              <div className="hide">
                <TeamMemberCard
                  fullName={fullName}
                  role={role}
                  src={`https:${goodPhotoUrl}`}
                  alt={goodAlt || ''}
                />
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
