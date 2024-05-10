import Link from 'next/link';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export const FooterButtonLink = ({ link, id, label, buttonStyle }) => (
  <Link id={id} href={link} data-cy="footer-link">
    <PrimaryButton size="medium" style={buttonStyle}>
      {label}
    </PrimaryButton>
  </Link>
);
