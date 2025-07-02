import { memo } from 'react'
import H1 from '@shared/typography/H1'
import Paper from '@shared/utils/Paper'
import StepList from './StepList'
import Button from '@shared/buttons/Button'
import StatusChip from './StatusChip'
import { WEBSITE_STATUS } from '../util/website.util'

function DraftState() {
  return (
    <Paper className="!p-4 text-left md:text-center">
      <StatusChip status={WEBSITE_STATUS.unpublished} />
      <H1 className="mt-2 mb-8">Finish your website</H1>
      <StepList type="draft" />
      <Button
        href="/dashboard/website/editor"
        color="secondary"
        className="mt-12 w-full md:w-auto px-10"
      >
        Complete and publish
      </Button>
    </Paper>
  )
}

export default memo(DraftState)
