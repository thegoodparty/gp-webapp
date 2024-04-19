import Image from 'next/image';
import Link from 'next/link';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

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

const BuildWithUsCard = ({
  header,
  blurb,
  href,
  linkText,
}) => <section className="rounded-3xl
  bg-tertiary-background
  p-5
  mb-4
  last:mb-0
  h-[252px]
  md:mb-0
  md:h-full">
  <div className="relative h-full">
    <h3
      className="text-tertiary-dark text-2xl font-medium leading-8 mb-4">{header}</h3>
    <p>{blurb}</p>
    <Link className="flex items-center text-tertiary-dark absolute bottom-0"
          href={href}>
      <BsFillArrowUpRightCircleFill
        className="inline mr-2 h-8 w-8" /><span>{linkText}</span>
    </Link>
  </div>
</section>;

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
      ({
        header,
        blurb,
        href,
        linkText,
      }, key) => <BuildWithUsCard
        key={key}
        header={header}
        blurb={blurb}
        href={href}
        linkText={linkText} />,
    )
  }
  <BuildWithUsImage
    src="/images/landing-pages/build-with-us-2.png"
    alt="Build With Us Person 2" />
</>;
