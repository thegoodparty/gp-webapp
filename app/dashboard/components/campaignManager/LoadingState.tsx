'use client'

import LoadingChecklist, {
  type LoadingItem,
} from '@shared/utils/LoadingChecklist'
import { Card, CardHeader, CardTitle } from '@styleguide'

const loadingItems: LoadingItem[] = [
  {
    label: 'Analyzing district data',
    status: 'loading',
  },
  {
    label: 'Calculating electoral goals',
    status: 'pending',
  },
  {
    label: 'Developing a strategic landscape',
    status: 'pending',
  },
  {
    label: 'Searching for local events',
    status: 'pending',
  },
  {
    label: 'Crafting voter outreach strategy',
    status: 'pending',
  },
  {
    label: 'Building your campaign timeline',
    status: 'pending',
  },
]

export default function LoadingState({
  isStreamComplete,
  hideCallback,
}: {
  isStreamComplete: boolean
  hideCallback: () => void
}) {
  return (
    <Card className="gap-0 p-0 font-opensans">
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-lg font-semibold">
          Preparing your campaign plan...
        </CardTitle>
      </CardHeader>
      <div className="p-6 pt-0">
        <LoadingChecklist
          items={loadingItems}
          onComplete={hideCallback}
          isComplete={isStreamComplete}
        />
      </div>
    </Card>
  )
}
