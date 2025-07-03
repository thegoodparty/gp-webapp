import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import H3 from '@shared/typography/H3'
import Paper from '@shared/utils/Paper'
import { dateUsHelper } from 'helpers/dateHelper'
import { FaCheck, FaRegClock, FaTimes } from 'react-icons/fa'
import { LuCircleCheckBig } from 'react-icons/lu'
import { MdOutlinePowerSettingsNew } from 'react-icons/md'

const statusToText = {
  newIssue: 'New Issue',
  accepted: 'Accepted',
  inProgress: 'In Progress',
  wontDo: "Won't Do",
  completed: 'Completed',
}
const statusToIcon = {
  newIssue: <MdOutlinePowerSettingsNew className="text-slate-500" />,
  accepted: <FaCheck className="text-green-300" />,
  inProgress: <FaRegClock className="text-yellow-500" />,
  wontDo: <FaTimes className="text-red-500" />,
  completed: <LuCircleCheckBig className="text-green-300" />,
}
export default function IssueSnippet({ issue }) {
  const { id, title, description, updatedAt, status } = issue
  return (
    <Paper className="mt-4">
      <div className="flex items-center mb-2">
        {statusToIcon[status] || <FaRegClock className="text-yellow-500" />}
        <Body2 className="text-slate-500 ml-2">ISS-{id}</Body2>
      </div>
      <div className="rounded-full py-1 px-3 border border-slate-200 inline-block text-xs font-medium">
        {statusToText[status]}
      </div>
      <H3 className="mt-4">{title}</H3>
      <Body1 className="text-slate-600 mt-1">{description}</Body1>
      <Body2 className="text-slate-500 mt-4">
        Updated: {dateUsHelper(updatedAt)}
      </Body2>
    </Paper>
  )
}
