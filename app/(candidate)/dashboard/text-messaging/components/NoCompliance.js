'use client'
import Paper from '@shared/utils/Paper'
import Body1 from '@shared/typography/Body1'
import Button from '@shared/buttons/Button'
import Image from 'next/image'
import H3 from '@shared/typography/H3'
import ComplianceHelpModal from './ComplianceHelpModal'
import { useState } from 'react'

export default function NoCompliance() {
  const [showModal, setShowModal] = useState(false)
  return (
    <Paper>
      <div className="py-4 md:py-12 lg:py-24 flex flex-col items-center">
        <Image
          src="/images/emojis/sad-emoji.svg"
          alt="sad emoji"
          width={100}
          height={100}
          priority
        />
        <H3 className="mt-8 mb-4">You are missing your 10DLC Compliance</H3>
        <Body1 className="mb-8 max-w-lg text-center px-2">
          Before you can send p2p text messages, you must complete the 10DLC
          (10-Digit Long Code) registration.
        </Body1>

        <Button className="mt-4" onClick={() => setShowModal(true)}>
          Start Registration
        </Button>
      </div>
      {showModal && (
        <ComplianceHelpModal
          open={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </Paper>
  )
}
