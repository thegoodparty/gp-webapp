'use client'

import { Button, Card } from '@styleguide'

interface FailedToGenerateProps {
  retryGeneration: () => void
}
export const FailedToGenerate = ({
  retryGeneration,
}: FailedToGenerateProps): React.JSX.Element => (
  <Card className="p-4">
    <p className="font-semibold font-opensans">
      We&apos;re having trouble building your campaign plan...
    </p>
    <div>
      <Button variant="default" className="mt-2" onClick={retryGeneration}>
        Retry now
      </Button>
    </div>
  </Card>
)
