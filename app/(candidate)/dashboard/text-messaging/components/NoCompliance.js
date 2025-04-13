'use client'
import Paper from '@shared/utils/Paper'
import Body1 from '@shared/typography/Body1'
import Button from '@shared/buttons/Button'
import Image from 'next/image'
import H3 from '@shared/typography/H3'
import Modal from '@shared/utils/Modal'
import { useState } from 'react'
import H1 from '@shared/typography/H1'
import Link from 'next/link'

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
        <Modal open={showModal} closeCallback={() => setShowModal(false)}>
          <div className="p-4 md:p-6 lg:p-8 min-w-[600px]">
            <H1 className="mb-8 text-center">How this works</H1>
            <Body1>
              We will walk you through the required steps, what&apos;s involved
              and why.
              <br />
              You will need the following information:
              <ul className="list-disc pl-4 mt-8">
                <li>EIN Number</li>
                <li>Compliant campaign website URL</li>
                <li>Campaign email address</li>
                <li>
                  Our team will reach out with next steps after you submit your
                  information
                </li>
              </ul>
              <div className="mt-8 flex justify-between">
                <Button color="neutral" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Link href="/dashboard/text-messaging/p2p-setup/ein">
                  <Button color="secondary">Start</Button>
                </Link>
              </div>
            </Body1>
          </div>
        </Modal>
      )}
    </Paper>
  )
}
