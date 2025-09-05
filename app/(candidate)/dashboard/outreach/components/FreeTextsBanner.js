'use client'
import { useState } from 'react'
import Button from '@shared/buttons/Button'
import { useCampaign } from '@shared/hooks/useCampaign'
import { OUTREACH_TYPES } from '../constants'
import TaskFlow from '../../components/tasks/flows/TaskFlow'
import { TCR_COMPLIANCE_STATUS } from 'app/(user)/profile/texting-compliance/components/ComplianceSteps'

export const FreeTextsBanner = ({ className = '', tcrCompliance }) => {
  const [campaign] = useCampaign()
  const [flowModalTask, setFlowModalTask] = useState(null)

  if (!campaign?.hasFreeTextsOffer) {
    return null
  }

  const isTextCompliant = tcrCompliance?.status === TCR_COMPLIANCE_STATUS.APPROVED
  if (!isTextCompliant) {
    return null
  }

  const handleSendClick = () => {
    setFlowModalTask({
      flowType: OUTREACH_TYPES.text,
    })
  }

  const handleCloseFlow = () => {
    setFlowModalTask(null)
  }

  return (
    <>
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between ${className}`}>
        <div className="flex items-center">
          <span className="text-blue-800 font-medium">
            Send your 5,000 free texts
          </span>
        </div>
        <span 
          className="font-bold text-blue-800 cursor-pointer hover:underline"
          onClick={handleSendClick}
        >
          Send
        </span>
      </div>

      {flowModalTask && campaign && (
        <TaskFlow
          forceOpen
          type={flowModalTask.flowType}
          campaign={campaign}
          onClose={handleCloseFlow}
        />
      )}
    </>
  )
}

export default FreeTextsBanner