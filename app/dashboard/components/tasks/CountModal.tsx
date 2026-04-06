'use client'

import { useState } from 'react'
import { Button, Input } from '@styleguide'
import { ModalOrDrawer } from '@shared/ui/ModalOrDrawer'
import type { LogTaskFlowType } from './LogTaskModal'

const COUNT_QUESTIONS: Record<LogTaskFlowType, string> = {
  text: 'How many texts did you schedule?',
  p2pDisabledText: 'How many texts did you schedule?',
  robocall: 'How many robocalls did you request?',
  doorKnocking: 'How many doors did you knock?',
  phoneBanking: 'How many calls did you make?',
  socialMedia: 'How many views did your post get?',
  events: 'How many voters did you meet?',
}

interface CountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  flowType: LogTaskFlowType | string
  onSubmit: (count: number) => void
}

export default function CountModal({
  open,
  onOpenChange,
  flowType,
  onSubmit,
}: CountModalProps) {
  const [value, setValue] = useState('')
  const question =
    flowType in COUNT_QUESTIONS
      ? COUNT_QUESTIONS[flowType as LogTaskFlowType]
      : 'How many did you complete?'

  const handleSave = () => {
    const parsed = parseInt(value, 10)
    if (!Number.isNaN(parsed) && parsed > 0) {
      onSubmit(parsed)
    }
    setValue('')
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setValue('')
    onOpenChange(nextOpen)
  }

  return (
    <ModalOrDrawer
      open={open}
      onOpenChange={handleOpenChange}
      title={question}
      dialogClassName="max-w-sm"
    >
      <form
        className="flex flex-col gap-4 p-4 md:p-2"
        onSubmit={(e) => {
          e.preventDefault()
          handleSave()
        }}
      >
        <p className="text-lg font-semibold">{question}</p>
        <Input
          type="number"
          placeholder="Enter amount"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min={0}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!value || parseInt(value, 10) <= 0}>
            Save
          </Button>
        </div>
      </form>
    </ModalOrDrawer>
  )
}
