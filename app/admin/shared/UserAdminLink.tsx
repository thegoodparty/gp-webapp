interface UserAdminLinkProps {
  userId: string | number
  className?: string
  children: React.ReactNode
}

export const UserAdminLink = ({ userId, className = '', children }: UserAdminLinkProps): React.JSX.Element => (
  <a href={`/admin/users?id=${userId}`} className={`underline ${className}`}>
    {children}
  </a>
)


