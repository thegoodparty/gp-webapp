import { Button } from '@styleguide'
import Link from 'next/link'

interface NavButtonProps {
  children: React.ReactNode
  className?: string
  href?: string
  id?: string
  'data-testid'?: string
  onClick?: () => void
}

const NavButton = ({
  children,
  className = '',
  href,
  id,
  'data-testid': dataTestId,
  onClick,
}: NavButtonProps): React.JSX.Element => {
  const sharedProps = {
    variant: 'ghost' as const,
    ...(id ? { id } : {}),
    ...(dataTestId ? { 'data-testid': dataTestId } : {}),
    ...(onClick ? { onClick } : {}),
    className:
      '!py-2 !leading-6 hover:!bg-primary-dark focus-visible:hover:!bg-primary-dark hover:!text-white focus-visible:!bg-white focus-visible:!outline-primary-dark/30 ' +
      className,
  }

  if (href) {
    return (
      <Button asChild {...sharedProps}>
        <Link href={href}>{children}</Link>
      </Button>
    )
  }

  return <Button {...sharedProps}>{children}</Button>
}

export default NavButton
