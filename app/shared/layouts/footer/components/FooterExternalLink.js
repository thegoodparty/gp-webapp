export const FooterExternalLink = ({ link, label, id }) => (
  <a
    id={id}
    href={link}
    className="pl-3"
    target="_blank"
    rel="noopener noreferrer nofollow"
    title={label}
    data-cy="footer-link"
  >
    {label}
  </a>
);
