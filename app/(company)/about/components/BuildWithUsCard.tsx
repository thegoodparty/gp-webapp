import Link from 'next/link'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

interface BuildWithUsCardProps {
  header: string
  blurb: string
  href: string
  linkText: string
}

export const BuildWithUsCard = ({
  header,
  blurb,
  href,
  linkText,
}: BuildWithUsCardProps): React.JSX.Element => (
  <section
    className="rounded-3xl
  bg-tertiary-background
  p-5
  mb-4
  last:mb-0
  h-[252px]
  md:mb-0
  md:h-full"
  >
    <div className="relative h-full">
      <h3 className="text-tertiary-dark text-2xl font-medium leading-8 mb-4">
        {header}
      </h3>
      <p>{blurb}</p>
      <Link
        className="flex items-center text-tertiary-dark absolute bottom-0"
        href={href}
      >
        <BsFillArrowUpRightCircleFill className="inline mr-2 h-8 w-8" />
        <span>{linkText}</span>
      </Link>
    </div>
  </section>
)
