import Button, { ButtonColor } from '@shared/buttons/Button'

interface FooterButtonLinkProps {
  link: string
  id: string
  label: string
  buttonStyle: ButtonColor
  isExternal?: boolean
}

export const FooterButtonLink = ({
  link,
  id,
  label,
  buttonStyle,
  isExternal,
}: FooterButtonLinkProps): React.JSX.Element => (
  <Button
    id={id}
    href={link}
    color={buttonStyle}
    className="focus-visible:outline-white/40 !text-base"
    target={isExternal ? '_blank' : undefined}
    rel={isExternal ? 'noopener noreferrer nofollow' : undefined}
  >
    {label}
  </Button>
)
