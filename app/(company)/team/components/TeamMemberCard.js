import Image from 'next/image'

const TeamMemberName = ({ children }) => (
  <div className="font-medium mb-1 text-xl" data-cy="member-name">
    {children}
  </div>
)

const TeamMemberRole = ({ children }) => (
  <div className="font-sfpro" data-cy="member-role">
    {children}
  </div>
)

export const TeamMemberCard = ({ src, alt, fullName, role }) => (
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
