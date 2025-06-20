import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Paper from '@shared/utils/Paper'
import IntroSteps from './IntroSteps'
import Button from '@shared/buttons/Button'
import Caption from '@shared/typography/Caption'

export default function EmptyState({ onClickCreate, createLoading }) {
  return (
    <div className="pt-4 px-2 text-left md:text-center">
      <H1>Create your free website</H1>
      <Body2 className="mt-2">
        Design a professional website to showcase your campaign, connect with
        voters, and share your vision for the community.
      </Body2>
      <Paper className="mt-8">
        <div className="flex flex-col gap-8 py-2">
          <IntroSteps />
        </div>
      </Paper>
      <Button
        color="secondary"
        className="mt-12 w-full md:w-auto px-10"
        onClick={onClickCreate}
        disabled={createLoading}
        loading={createLoading}
      >
        {createLoading ? 'Creating...' : 'Create your website'}
      </Button>
      <Caption className="mt-4 text-center font-medium text-gray-700">
        Estimated time: 10 minutes
      </Caption>
    </div>
  )
}
