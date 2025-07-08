'use client'
import Paper from '@shared/utils/Paper'
import Body1 from '@shared/typography/Body1'
import H3 from '@shared/typography/H3'
import AddIssueButton from './AddIssueButton'

export default function EmptyIssues() {
  return (
    <Paper className="mt-8">
      <div className="py-4 md:py-12 lg:py-24 flex flex-col items-center">
        <H3 className="mt-8 mb-4">No community issues found</H3>
        <Body1 className="mb-8 max-w-lg text-center px-2">
          You haven&apos;t added any community issues yet. Start by identifying
          the topics that matter most to your community.
        </Body1>

        <AddIssueButton />
      </div>
    </Paper>
  )
}
