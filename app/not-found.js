import H2 from '@shared/typography/H2';
import H3 from '@shared/typography/H3';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center">
      <H2>Not Found</H2>
      <H3 className="my-3">Could not find requested resource</H3>
      <Link href="/">
        <Image
          src="/images/logo-hologram.svg"
          data-cy="logo"
          width={145}
          height={32}
          alt="GOOD PARTY"
          priority
        />
      </Link>
    </div>
  );
}
