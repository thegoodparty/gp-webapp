import H2 from '@shared/typography/H2'
import Paper from '@shared/utils/Paper'
import BlockedAnimation from '@shared/animations/BlockedAnimation'
import Body1 from '@shared/typography/Body1'
import Button from '@shared/buttons/Button'
import Link from 'next/link'

export default function NoCompliance() {
  return (
    <Paper
      className="mb-4 border-red-500 bg-red-50"
      style={{ backgroundColor: '#ffe8e8' }}
    >
      <H2 className="mb-4">Missing 10DLC Compliance</H2>
      <Body1>
        Before you can send p2p text messages, you must complete the 10DLC
        (10-Digit Long Code) registration
      </Body1>
      <div className="flex flex-col justify-center items-center">
        <div className="w-96 relative mt-8">
          <BlockedAnimation />
        </div>
        <Link href="/dashboard/text-messaging/p2p-setup/ein">
          <Button className="mt-4">Start 10DLC Registration</Button>
        </Link>
      </div>
    </Paper>
  )
}
