'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useVoterContacts } from '@shared/hooks/useVoterContacts'
import { Card, Progress } from '@styleguide'
import { calculateVoterContactCounts } from '../voterGoalsHelpers'
import { numberFormatter } from 'helpers/numberHelper'
import { useState } from 'react'
import { InfoOutlined } from '@mui/icons-material'
import { ContactCountsInfoModal } from '../ContactCountsInfoModal'

export default function ProgressSection() {
  const [campaign] = useCampaign()
  const [modalOpen, setModalOpen] = useState(false)
  const toggleModalOpen = () => setModalOpen(!modalOpen)
  const p2vData = campaign?.pathToVictory?.data

  const [reportedVoterGoals] = useVoterContacts()
  const { needed, contacted } = calculateVoterContactCounts(
    p2vData,
    reportedVoterGoals,
  )
  const progress = needed > 0 ? (contacted / needed) * 100 : 0
  return (
    <Card className="p-6">
      <div className="flex w-full justify-between items-center mb-2 border-b border-primary/20 pb-6">
        <div className="text-lg font-semibold">Your campaign progress</div>
        <div className="text-sm text-primary cursor-pointer hover:underline">
          Record voter contacts
        </div>
      </div>
      <Progress value={progress} className="w-full" />
      <div className="flex w-full justify-between items-center text-sm">
        <div>{numberFormatter(contacted)} voters contacted</div>
        <div onClick={toggleModalOpen}>
          {numberFormatter(needed)} voter contacts needed to win
          <InfoOutlined className="ml-2 !text-base" />
          <ContactCountsInfoModal
            pathToVictory={p2vData}
            open={modalOpen}
            setOpen={toggleModalOpen}
          />
        </div>
      </div>
    </Card>
  )
}
