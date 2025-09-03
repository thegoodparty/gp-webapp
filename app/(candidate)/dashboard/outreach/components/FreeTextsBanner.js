'use client'
import { useState } from 'react'
import Button from '@shared/buttons/Button'
import { useCampaign } from '@shared/hooks/useCampaign'
import { OUTREACH_TYPES } from '../constants'
import TaskFlow from '../../components/tasks/flows/TaskFlow'

export const FreeTextsBanner = ({ className = '' }) => {
  const [campaign] = useCampaign()
  const [showFlow, setShowFlow] = useState(false)

  // Don't show banner if campaign doesn't have free texts offer
  if (!campaign?.hasFreeTextsOffer) {
    return null
  }

  const handleSendClick = () => {
    setShowFlow(true)
  }

  const handleCloseFlow = () => {
    setShowFlow(false)
  }

  return (
    <>
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between ${className}`}>
        <div className="flex items-center">
          <span className="text-blue-800 font-medium">
            Send your 5,000 free texts
          </span>
        </div>
        <Button 
          variant="primary" 
          size="small"
          onClick={handleSendClick}
        >
          Send
        </Button>
      </div>

      {showFlow && (
        <TaskFlow
          type={OUTREACH_TYPES.text}
          onComplete={handleCloseFlow}
          onCancel={handleCloseFlow}
        />
      )}
    </>
  )
}

export default FreeTextsBanner