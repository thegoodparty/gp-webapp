interface FooterExternalLinkProps {
  link: string
  label: string
  id: string
}

export const FooterExternalLink = ({
  link,
  label,
  id,
}: FooterExternalLinkProps): React.JSX.Element => (
  <a
    id={id}
    href={link}
    className="ml-3"
    target="_blank"
    rel="noopener noreferrer nofollow"
    title={label}
    data-cy="footer-link"
  >
    {label}
  </a>
)
