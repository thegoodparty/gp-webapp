import BlackButton from '@shared/buttons/BlackButton';
import Link from 'next/link';
import Image from 'next/image';
export default function Hero() {
  return (
    <section className="mt-20 text-center">
      <h1 data-cy="run-title" className="mb-5 text-3xl font-black lg:text-4xl">
        Run as an Indie or 3rd Party.
      </h1>
      <div data-cy="run-description" className="text-lg">
        We've made it simple and free like democracy{' '}
        <strong>
          <i>should be.</i>
        </strong>
      </div>
      <div className="text-sm mt-10 mb-3 text-neutral-500">
        we're always free
      </div>
      <Link
        href="/campaign-application/guest/1"
        data-cy="campaign-start-button-link"
      >
        <BlackButton>
          <div data-cy="campaign-start-button-label" className="font-black">
            START YOUR CAMPAIGN
          </div>
        </BlackButton>
      </Link>
      <div className="mt-5 underline">
        <Link href="#questions" data-cy="run-questions">
          How does a campaign work?
        </Link>
      </div>
      <div className="mt-20 mb-5 flex justify-center">
        <Image
          src="/images/certified-black.svg"
          alt="Good Certified"
          height={70}
          width={70}
          data-cy="certified-badge"
          priority
        />
      </div>
    </section>
  );
}
