'use client'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import Paper from '@shared/utils/Paper'
import DashboardLayout from '../../shared/DashboardLayout'

interface BriefingsPageProps {
  pathname: string
}

export default function BriefingsPage({ pathname }: BriefingsPageProps) {
  return (
    <DashboardLayout pathname={pathname} showAlert={false}>
      <Paper className="min-h-full">
        <H1>Meeting Briefings</H1>
        <Body1 className="text-gray-500 mb-6">
          AI-prepared briefings for your upcoming council meetings
        </Body1>
        <div className="mt-8 text-center text-gray-500">
          <p className="text-lg font-medium">No briefings yet</p>
          <p className="text-sm mt-1">
            Briefings will appear here before your upcoming meetings.
          </p>
        </div>
      </Paper>
    </DashboardLayout>
  )
}
