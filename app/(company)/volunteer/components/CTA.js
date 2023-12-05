import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';

export default function CTA({ id }) {
  return (
    <Link href="/info-session" id={id}>
      <WarningButton>Get Involved</WarningButton>
    </Link>
  );
}
