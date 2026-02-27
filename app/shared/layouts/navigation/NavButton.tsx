import Button from '@shared/buttons/Button'

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
  const buttonProps = {
    variant: 'text' as const,
    ...(href ? { href } : {}),
    ...(id ? { id } : {}),
    ...(dataTestId ? { 'data-testid': dataTestId } : {}),
    ...(onClick ? { onClick } : {}),
    className:
      '!py-2 hover:!bg-primary-dark focus-visible:hover:!bg-primary-dark hover:!text-white focus-visible:!bg-white focus-visible:!outline-primary-dark/30 ' +
      className,
  }

  return <Button {...buttonProps}>{children}</Button>
}

export default NavButton
