import Body1 from '@shared/typography/Body1'
import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'

export default function IssueDescription({ issue }) {
  const { description } = issue

  return (
    <Paper className="col-span-12 md:col-span-8">
      <H2 className="mb-2">Issue Description</H2>
      <Body1>{description}</Body1>
    </Paper>
  )
}
