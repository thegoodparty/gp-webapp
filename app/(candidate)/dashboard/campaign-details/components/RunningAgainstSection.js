'use client'

import { useState } from 'react'
import H3 from '@shared/typography/H3'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import RunningAgainstForm from './RunningAgainstForm'
import RunningAgainstCard from './RunningAgainstCard'
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper'

export default function RunningAgainstSection({
  campaign,
  nextCallback,
  header,
}) {
  const [isSaving, setIsSaving] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [runningAgainst, setRunningAgainst] = useState(
    campaign?.details?.runningAgainst || [],
  )

  const handleSave = async () => {
    trackEvent(EVENTS.Profile.RunningAgainst.ClickSave)
    setIsSaving(true)
    await updateCampaign([
      { key: 'details.runningAgainst', value: runningAgainst },
    ])

    setIsSaving(false)

    if (nextCallback) {
      nextCallback()
    } else {
      window.location.reload()
    }
  }

  const handleDelete = (index) => {
    setRunningAgainst((current) => current.toSpliced(index, 1))
  }

  const handleUpdate = (index, newValues) => {
    setShowNew(false)
    setRunningAgainst((current) => {
      const runningAgainst = [...current]

      if (typeof index === 'number') {
        runningAgainst[index] = newValues
      } else {
        runningAgainst.push(newValues)
      }
      return runningAgainst
    })
  }

  return (
    <section className={` pt-6  ${header ? '' : 'border-t  border-gray-600'}`}>
      {header ? <>{header}</> : <H3>Who You&apos;re Running Against</H3>}

      {runningAgainst.map((against, index) => {
        return (
          <RunningAgainstCard
            key={index}
            {...against}
            onDelete={() => handleDelete(index)}
            onUpdate={(newValues) => handleUpdate(index, newValues)}
          />
        )
      })}

      <div className="my-6 border rounded-xl p-4 border-gray-300 flex justify-between">
        {showNew ? (
          <RunningAgainstForm
            onCancel={() => {
              trackEvent(EVENTS.Profile.RunningAgainst.CancelAddNew)
              setShowNew(false)
            }}
            onSave={(newValues) => {
              trackEvent(EVENTS.Profile.RunningAgainst.SubmitAddNew)
              handleUpdate(null, newValues)
            }}
          />
        ) : (
          <PrimaryButton
            size="medium"
            onClick={() => {
              trackEvent(EVENTS.Profile.RunningAgainst.ClickAddNew)
              setShowNew(true)
            }}
          >
            Add New Opponent
          </PrimaryButton>
        )}
      </div>

      <div className="flex justify-end mb-6">
        <PrimaryButton
          loading={isSaving}
          disabled={isSaving}
          onClick={handleSave}
        >
          Save
        </PrimaryButton>
      </div>
    </section>
  )
}
