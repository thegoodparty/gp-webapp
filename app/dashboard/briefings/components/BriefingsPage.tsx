'use client'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import Paper from '@shared/utils/Paper'
import DashboardLayout from '../../shared/DashboardLayout'
import BriefingListCard from './BriefingListCard'
import { BriefingListItem } from '../shared/briefing-types'

interface BriefingsPageProps {
  pathname: string
  briefings: BriefingListItem[]
}

export default function BriefingsPage({
  pathname,
  briefings,
}: BriefingsPageProps) {
  return (
    <DashboardLayout pathname={pathname} showAlert={false}>
      <Paper className="min-h-full">
        <H1>Meeting Briefings</H1>
        <Body1 className="text-gray-500 mb-6">
          AI-prepared briefings for your upcoming council meetings
        </Body1>
        {briefings.length === 0 ? (
          <div className="mt-8 text-center text-gray-500">
            <p className="text-lg font-medium">No briefings yet</p>
            <p className="text-sm mt-1">
              Briefings will appear here before your upcoming meetings.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {briefings.map((briefing) => (
              <BriefingListCard
                key={`${briefing.citySlug}-${briefing.date}`}
                briefing={briefing}
              />
            ))}
          </div>
        )}
      </Paper>
    </DashboardLayout>
  )
}
