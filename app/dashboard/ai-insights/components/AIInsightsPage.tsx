'use client'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../shared/DashboardLayout'
import { Campaign } from 'helpers/types'
import { ExperimentRun, ExperimentId } from '../types'
import { ExperimentTab } from './ExperimentTab'
import { useOrganization } from '@shared/organization-picker'

interface AIInsightsPageProps {
  pathname: string
  campaign: Campaign | null
  initialRuns: ExperimentRun[]
}

const WIN_TABS: { id: ExperimentId; label: string; description: string }[] = [
  {
    id: 'voter_targeting',
    label: 'Voter Targeting',
    description:
      'Analyze your district to identify the most persuadable voter segments. Get a breakdown by demographics, geography, and voting history to focus your outreach where it matters most.',
  },
  {
    id: 'walking_plan',
    label: 'Walking Plan',
    description:
      'Generate an optimized door-knocking route based on voter density and persuadability scores. Maximize the number of high-value conversations per hour of canvassing.',
  },
]

const SERVE_TABS: { id: ExperimentId; label: string; description: string }[] = [
  {
    id: 'district_intel',
    label: 'District Intel',
    description:
      'Get a comprehensive intelligence brief on your district. Pulls recent meeting minutes, local news, and community issues, then maps each issue to the constituents it affects.',
  },
  {
    id: 'peer_city_benchmarking',
    label: 'Peer City Benchmarking',
    description:
      'See how similar cities are handling the same issues your district faces. Compares approaches, budgets, timelines, and outcomes from 3-5 peer cities.',
  },
  {
    id: 'meeting_briefing',
    label: 'Meeting Briefing',
    description:
      'Get a personalized governance briefing before your next council meeting. Pulls agenda data, fiscal context, and constituency signals into a ready-to-use memo.',
  },
]

export const AIInsightsPage = ({
  pathname,
  campaign,
  initialRuns,
}: AIInsightsPageProps) => {
  const organization = useOrganization()
  const isServe = !!organization?.electedOfficeId
  const tabs = isServe ? SERVE_TABS : WIN_TABS
  const [activeTab, setActiveTab] = useState<ExperimentId>(
    tabs[0]?.id ?? 'voter_targeting',
  )

  useEffect(() => {
    setActiveTab(tabs[0]?.id ?? 'voter_targeting')
  }, [isServe])

  const latestRun = initialRuns
    ?.filter((run) => run.experimentId === activeTab)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0]

  const activeTabDef = tabs.find((t) => t.id === activeTab) ?? tabs[0]

  return (
    <DashboardLayout pathname={pathname} campaign={campaign}>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold mb-2">AI Insights</h1>
        <p className="text-muted-foreground mb-1">
          AI-powered reports to sharpen your campaign strategy.
        </p>
        <p className="text-xs text-muted-foreground/70 mb-6">
          AI-generated content may contain errors. Always verify data before making campaign decisions.
        </p>

        {tabs.length > 1 && (
          <div className="border-b mb-6">
            <div className="flex gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTabDef && (
          <ExperimentTab
            key={activeTabDef.id}
            experimentId={activeTabDef.id}
            description={activeTabDef.description}
            initialRun={latestRun}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
