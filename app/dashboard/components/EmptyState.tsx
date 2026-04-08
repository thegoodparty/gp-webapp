'use client'
import WandAnimation from '@shared/animations/WandAnimation'
import Body1 from '@shared/typography/Body1'
import H3 from '@shared/typography/H3'
import Paper from '@shared/utils/Paper'
import { usePositionName } from '@shared/hooks/usePositionName'

export default function EmptyState(): React.JSX.Element {
  const positionName = usePositionName()
  return (
    <Paper>
      <div className="p-4 md:py-8 lg:py-12 flex items-center justify-center">
        <div className="flex flex-col items-center text-center ">
          <div className="h-24 w-24">
            <WandAnimation loop />
          </div>
          <H3 className="mt-4">
            We&apos;re currently gathering the necessary data for{' '}
            <strong>{positionName || 'your office'}.</strong>
          </H3>
          <Body1 className="mt-4">
            While you wait, we suggest you check out our educational content on
            making the most of your account{' '}
            <a
              href="https://goodpartyorg.circle.so/c/start-here"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
            <br />
            If you need assistance, email us at{' '}
            <a href="mailto:support@goodparty.org">support@goodparty.org</a>
          </Body1>
        </div>
      </div>
    </Paper>
  )
}
