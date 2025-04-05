import Button from '@shared/buttons/Button'

export const FooterButtonLink = ({ link, id, label, buttonStyle }) => (
  <Button
    id={id}
    href={link}
    color={buttonStyle}
    className="focus-visible:outline-white/40 !text-base"
  >
    {label}
  </Button>
)
