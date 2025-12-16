import Image from 'next/image'

interface TeamMemberNameProps {
  children: React.ReactNode
}

const TeamMemberName = ({ children }: TeamMemberNameProps): React.JSX.Element => (
  <div className="font-medium mb-1 text-xl" data-cy="member-name">
    {children}
  </div>
)

interface TeamMemberRoleProps {
  children: React.ReactNode
}

const TeamMemberRole = ({ children }: TeamMemberRoleProps): React.JSX.Element => (
  <div className="font-sfpro" data-cy="member-role">
    {children}
  </div>
)

interface TeamMemberCardProps {
  src: string
  alt: string
  fullName: string
  role: string
}

export const TeamMemberCard = ({
  src,
  alt,
  fullName,
  role,
}: TeamMemberCardProps): React.JSX.Element => (
  <>
    <Image
      className="block mb-3 w-full h-auto rounded-3xl border-2"
      src={src}
      alt={alt}
      width={500}
      height={500}
      data-cy="member-avatar"
    />
    <TeamMemberName>{fullName}</TeamMemberName>
    <TeamMemberRole>{role}</TeamMemberRole>
  </>
)
