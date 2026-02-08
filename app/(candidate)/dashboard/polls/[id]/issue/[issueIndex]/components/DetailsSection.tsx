import H4 from '@shared/typography/H4'
import { Card, CardContent } from 'goodparty-styleguide'
import { LuClipboardList } from 'react-icons/lu'
import { useIssue } from '../../../../shared/hooks/IssueProvider'
import Body1 from '@shared/typography/Body1'
import RepComments from './RepComments'

export default function DetailsSection(): React.JSX.Element {
  const { details } = useIssue()
  return (
    <section className="my-4">
      <Card>
        <CardContent>
          <div className="flex items-center gap-2">
            <LuClipboardList />
            <H4>Details</H4>
          </div>
          <Body1 className="mt-4">{details}</Body1>

          <RepComments />
        </CardContent>
      </Card>
    </section>
  )
}
