import Link from 'next/link';
import { BsArrowUpRightCircleFill } from 'react-icons/bs';

export const LeadingActivityCard = ({
  icon,
  title,
  description,
  linkText,
  href,
}) => (
  <div className="p-5 mb-4 last:mb-0 rounded-3xl bg-tertiary-background">
    <h3
      className="text-2xl mb-4 text-tertiary-dark font-medium flex flex-row items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <p className="text-base font-sfpro font-normal">{description}</p>
    <Link
      className="text-tertiary-dark flex flex-row items-center mt-24"
      href={href}
    >
      <BsArrowUpRightCircleFill className="text-3xl mr-1" />
      {linkText}
    </Link>
  </div>
);
