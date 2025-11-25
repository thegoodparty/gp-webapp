import Button, { ButtonColor } from '@shared/buttons/Button'

interface FooterButtonLinkProps {
  link: string
  id: string
  label: string
  buttonStyle: ButtonColor
}

export const FooterButtonLink = ({ link, id, label, buttonStyle }: FooterButtonLinkProps): React.JSX.Element => (
  <Button
    id={id}
    href={link}
    color={buttonStyle}
    className="focus-visible:outline-white/40 !text-base"
  >
    {label}
  </Button>
)

