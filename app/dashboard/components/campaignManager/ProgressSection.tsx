'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useVoterContacts } from '@shared/hooks/useVoterContacts'
import { Card, Progress } from '@styleguide'
import { calculateVoterContactCounts } from '../voterGoalsHelpers'
import { numberFormatter } from 'helpers/numberHelper'
import { useState } from 'react'

import { Info } from 'lucide-react'
import { CountsInfoModal } from './CountsInfoModal'
import { RecordVoterContactsModal } from './RecordVoterContactsModal'

export default function ProgressSection() {
  const [campaign] = useCampaign()
  const [modalOpen, setModalOpen] = useState(false)
  const [recordModalOpen, setRecordModalOpen] = useState(false)
  const p2vData = campaign?.pathToVictory?.data
  const toggleModalOpen = () => setModalOpen(!modalOpen)
  const toggleRecordModalOpen = () => setRecordModalOpen(!recordModalOpen)

  const [reportedVoterGoals] = useVoterContacts()
  const { needed, contacted } = calculateVoterContactCounts(
    p2vData,
    reportedVoterGoals,
  )
  const progress = needed > 0 ? Math.min((contacted / needed) * 100, 100) : 0
  return (
    <Card className="p-6 shadow-none">
      <div className="flex w-full justify-between items-center mb-2 border-b pb-6">
        <div className="text-lg font-semibold font-opensans">
          Your campaign progress
        </div>
        <div
          className="text-sm text-primary cursor-pointer hover:underline"
          onClick={toggleRecordModalOpen}
        >
          Record voter contacts
        </div>
      </div>
      <Progress value={progress} className="w-full" />
      <div className="flex w-full justify-between items-center text-sm">
        <div>{numberFormatter(contacted)} voters contacted</div>
        <div
          onClick={toggleModalOpen}
          className="cursor-pointer flex items-center gap-2"
        >
          <div>{numberFormatter(needed)} voter contacts needed to win</div>
          <Info className="inline-block" size={16} />
        </div>
      </div>
      <CountsInfoModal
        pathToVictory={p2vData}
        open={modalOpen}
        setOpen={toggleModalOpen}
      />
      <RecordVoterContactsModal
        open={recordModalOpen}
        setOpen={setRecordModalOpen}
      />
    </Card>
  )
}
