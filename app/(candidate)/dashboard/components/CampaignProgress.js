'use client'
import { calculateVoterContactCounts } from 'app/(candidate)/dashboard/components/voterGoalsHelpers'
import { useState } from 'react'
import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'
import {
  ANIMATED_PROGRESS_BAR_SIZES,
  AnimatedProgressBar,
} from 'app/(candidate)/dashboard/components/p2v/AnimatedProgressBar'
import Subtitle2 from '@shared/typography/Subtitle2'
import { numberFormatter } from 'helpers/numberHelper'
import { BsInfoCircle } from 'react-icons/bs'
import { ContactCountsInfoModal } from 'app/(candidate)/dashboard/components/ContactCountsInfoModal'
import Button from '@shared/buttons/Button'
import { RecordVoterContactsModal } from 'app/(candidate)/dashboard/components/RecordVoterContactsModal'
import { useVoterContacts } from '@shared/hooks/useVoterContacts'

export const CampaignProgress = ({ pathToVictory }) => {
  const [reportedVoterGoals] = useVoterContacts()
  const { needed, contacted } = calculateVoterContactCounts(
    pathToVictory,
    reportedVoterGoals,
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [recordModalOpen, setRecordModalOpen] = useState(false)

  const toggleModalOpen = () => setModalOpen(!modalOpen)
  const toggleRecordModal = () => setRecordModalOpen(!recordModalOpen)

  return (
    <Paper className="mb-4">
      <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 mb-4">
        <H2>Campaign progress</H2>
        <Button color="neutral" size="medium" onClick={toggleRecordModal}>
          Record voter contacts
        </Button>
      </div>
      <div className="mb-4">
        <AnimatedProgressBar
          percent={(contacted / needed) * 100}
          size={ANIMATED_PROGRESS_BAR_SIZES.MD}
        />
      </div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <Subtitle2>{numberFormatter(contacted)} voters contacted</Subtitle2>
        <Subtitle2 className="flex items-center">
          {numberFormatter(needed)} voter contacts needed
          <BsInfoCircle
            className="ml-2 inline cursor-pointer"
            onClick={toggleModalOpen}
          />
          <ContactCountsInfoModal
            {...{ pathToVictory, open: modalOpen, setOpen: toggleModalOpen }}
          />
        </Subtitle2>
      </div>
      <RecordVoterContactsModal
        open={recordModalOpen}
        setOpen={setRecordModalOpen}
      />
    </Paper>
  )
}
