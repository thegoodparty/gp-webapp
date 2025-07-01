import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import AddIssueForm from './AddIssueForm'
import Link from 'next/link'
import Body2 from '@shared/typography/Body2'
import { MdOutlineArrowBack } from 'react-icons/md'

export default function AddIssuePage() {
  return (
    <div className="bg-indigo-100 p-2 md:p-4 min-h-[calc(100vh-56px)]">
      <Link
        href="/dashboard/issues"
        className="my-2 flex items-center text-gray-500 "
      >
        <MdOutlineArrowBack className="mr-2 " />
        <Body2>Back to issues</Body2>
      </Link>
      <div className="max-w-2xl mx-auto mt-8">
        <H1>Add an issue</H1>
        <Body1 className="text-slate-600 mt-1">
          Manually log an issue reported via phone, in-person meeting, or other
          channel.
        </Body1>
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-4">
          <AddIssueForm />
        </div>
      </div>
    </div>
  )
}
