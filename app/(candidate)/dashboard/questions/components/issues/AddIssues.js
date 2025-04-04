import Body1 from '@shared/typography/Body1'
import IssuesSelector from './IssuesSelector'

export default function AddIssues(props) {
  return (
    <div>
      <h1 className="text-[32px] mb-2 text-center">
        What are the top 3 issues you care about?
      </h1>
      <Body1 className="text-center mb-6">
        These will be the focus of your campaign and help you connect with
        voters. <br />
        Don&apos;t worry, you can always change these later.
      </Body1>
      <IssuesSelector {...props} />
    </div>
  )
}
