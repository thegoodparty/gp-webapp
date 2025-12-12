import Link from 'next/link'
import { BsArrowUpRightCircleFill } from 'react-icons/bs'
import { ReactNode } from 'react'

interface LeadingActivityCardProps {
  icon: ReactNode
  title: string
  description: string
  linkText: string
  href: string
}

export const LeadingActivityCard = ({
  icon,
  title,
  description,
  linkText,
  href,
}: LeadingActivityCardProps): React.JSX.Element => (
  <div className="p-5 mb-4 last:mb-0 rounded-3xl bg-tertiary-background min-h-[418px] lg:min-h-[430px] flex flex-col justify-between">
    <div>
      <h3 className="text-2xl mb-4 text-tertiary-dark font-medium flex flex-row items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <p className="text-base font-sfpro font-normal">{description}</p>
    </div>
    <Link className="text-tertiary-dark flex flex-row items-center" href={href}>
      <BsArrowUpRightCircleFill className="text-3xl mr-1.5" />
      {linkText}
    </Link>
  </div>
)
