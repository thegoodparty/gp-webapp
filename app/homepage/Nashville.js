import PrimaryButton from '@shared/buttons/PrimaryButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import H3 from '@shared/typography/H3';
import Image from 'next/image';
import Link from 'next/link';

export default function Nashville() {
  return (
    <MaxWidth>
      <div className="flex flex-col items-center mt-12">
        <Image
          src="/images/homepage-jan23/nashville.svg"
          width={1055}
          height={471}
          alt="Nashville"
        />
        <H3 className="mt-16 mb-12">
          Learn about new Good Party Certified candidates in Nashville.
          <br />
          <br />
          The Music City is our first election this year on{' '}
          <strong>August 3rd</strong>, check out who we&apos;re supporting!
        </H3>
        <Link href="/elections/nashville/2023">
          <PrimaryButton>See the candidates</PrimaryButton>
        </Link>
      </div>
    </MaxWidth>
  );
}
