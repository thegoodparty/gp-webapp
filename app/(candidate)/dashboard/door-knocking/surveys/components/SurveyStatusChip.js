import Body2 from '@shared/typography/Body2'

import Chip from '@shared/utils/Chip'
import { MdPublish } from 'react-icons/md'
export default function SurveyStatusChip({ survey }) {
  const { status } = survey || {}
  return (
    <>
      {status === 'Live' ? (
        <Chip className="mt-4 bg-green-200 text-green-800" icon={<MdPublish />}>
          <Body2>Published</Body2>
        </Chip>
      ) : (
        <Chip className="mt-4 bg-gray-100 text-gray-800">
          <Body2>Unpublished</Body2>
        </Chip>
      )}
    </>
  )
}
