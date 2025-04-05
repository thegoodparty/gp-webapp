export const UserAdminLink = ({ userId, className = '', children }) => (
  <a href={`/admin/users?id=${userId}`} className={`underline ${className}`}>
    {children}
  </a>
)
