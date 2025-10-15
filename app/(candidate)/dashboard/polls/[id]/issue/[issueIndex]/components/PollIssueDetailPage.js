'use client'

import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import { useElectedOffice } from '@shared/hooks/useElectedOffice'
import Paper from '@shared/utils/Paper'
import Crumbs from '../../../../shared/Crumbs'
import Title from './Title'
import ConfidenceAlert from 'app/(candidate)/dashboard/polls/shared/ConfidenceAlert'
import DetailsSection from './DetailsSection'

export default function PollIssueDetailPage({ pathname }) {
  const { electedOffice } = useElectedOffice()

  return (
    <DashboardLayout pathname={pathname} campaign={electedOffice} showAlert={false}>
      <Paper className="min-h-full">
        <Crumbs />
        <Title />
        <ConfidenceAlert />
        <DetailsSection />
      </Paper>
    </DashboardLayout>
  )
}
