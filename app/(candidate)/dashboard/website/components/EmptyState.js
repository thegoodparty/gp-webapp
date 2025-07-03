import { memo } from 'react'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Paper from '@shared/utils/Paper'
import StepList from './StepList'
import Button from '@shared/buttons/Button'

function EmptyState({ onClickCreate, createLoading }) {
  return (
    <Paper className="!p-4 text-left md:text-center">
      <span className="px-2 py-1 rounded-full bg-gray-100 text-xs border border-black/[0.12]">
        10 minutes
      </span>
      <H1 className="my-2">Create your free website</H1>
      <Body2 className="mb-8">
        Design a professional website to showcase your campaign, connect with
        voters, and share your vision for the community.
      </Body2>
      <StepList />
      <Button
        color="secondary"
        className="mt-12 w-full md:w-auto px-10"
        onClick={onClickCreate}
        disabled={createLoading}
        loading={createLoading}
      >
        {createLoading ? 'Creating...' : 'Create your website'}
      </Button>
    </Paper>
  )
}

export default memo(EmptyState)
