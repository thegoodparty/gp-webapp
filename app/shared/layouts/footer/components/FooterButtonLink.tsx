import { Button } from '@styleguide'
import Link from 'next/link'

interface FooterButtonLinkProps {
  link: string
  id: string
  label: string
  isExternal?: boolean
}

export const FooterButtonLink = ({
  link,
  id,
  label,
  isExternal,
}: FooterButtonLinkProps): React.JSX.Element => {
  if (isExternal) {
    return (
      <Button
        asChild
        variant="secondary"
        id={id}
        className="focus-visible:outline-white/40 !text-base"
      >
        <a href={link} target="_blank" rel="noopener noreferrer nofollow">
          {label}
        </a>
      </Button>
    )
  }

  return (
    <Button
      asChild
      variant="secondary"
      id={id}
      className="focus-visible:outline-white/40 !text-base"
    >
      <Link href={link}>{label}</Link>
    </Button>
  )
}
