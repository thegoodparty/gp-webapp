import Image from 'next/image';
import { BuildWithUsCard } from './BuildWithUsCard';

const BUILD_WITH_US_CARDS = [
  {
    header: 'Run for office',
    blurb: 'Discover how you can run for office and make a real impact in your community.',
    href: '/run-for-office',
    linkText: 'Start your campaign'
  },
  {
    header: 'Join our team',
    blurb: 'Discover how you can run for office and make a real impact in your community.',
    href: '/team',
    linkText: 'Explore careers'
  },
  {
    header: 'Volunteer',
    blurb: 'Create impact by giving your support to upstart independent campaigns that need talented and passionate volunteers.',
    href: '/volunteer',
    linkText: 'Volunteer with us'
  }
]

const BuildWithUsImage = ({ src, alt, className }) => <Image
  className={`w-full rounded-3xl mb-4 last:mb-0 md:mb-0 ${className ? className : ''}`}
  src={src}
  alt={alt}
  height={300}
  width={300} />;

export const BuildWithUsGridItems = () => <>
  <BuildWithUsImage
    className="md:col-start-2 xl:col-start-3"
    src="/images/landing-pages/build-with-us-1.png"
    alt="Build With Us Person 1" />
  {
    BUILD_WITH_US_CARDS.map(
      (card, key) => <BuildWithUsCard
        {...card}
        key={key} />,
    )
  }
  <BuildWithUsImage
    src="/images/landing-pages/build-with-us-2.png"
    alt="Build With Us Person 2" />
</>;
