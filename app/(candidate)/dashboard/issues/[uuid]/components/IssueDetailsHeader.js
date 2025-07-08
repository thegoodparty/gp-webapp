import Body2 from '@shared/typography/Body2'
import H1 from '@shared/typography/H1'
import { dateUsHelper } from 'helpers/dateHelper'
import Link from 'next/link'
import { FaMapMarkerAlt, FaRegClock } from 'react-icons/fa'
import { MdOutlineArrowBack } from 'react-icons/md'
import StatusPill from '../../shared/StatusPill'

export default function IssueDetailsHeader({ issue }) {
  const { title, location, status, createdAt } = issue

  return (
    <>
      <Link
        href="/dashboard/issues"
        className="my-2 flex items-center text-gray-500 "
      >
        <MdOutlineArrowBack className="mr-2 " />
        <Body2>Back to issues</Body2>
      </Link>

      <H1 className="mt-8">{title}</H1>
      <div className="flex items-center gap-2 mt-2">
        <FaRegClock className="text-gray-500" />
        <Body2 className="text-gray-500">
          Submitted {dateUsHelper(createdAt)}
        </Body2>
      </div>
      {location && (
        <div className="flex items-center gap-2 mt-2">
          <FaMapMarkerAlt className="text-gray-500" />
          <Body2 className="text-gray-500">{location}</Body2>
        </div>
      )}
      <div className="mt-4">
        <StatusPill status={status} />
      </div>
    </>
  )
}
