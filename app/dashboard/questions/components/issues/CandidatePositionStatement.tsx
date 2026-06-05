import { noop } from '@shared/utils/noop'
import { Label, Textarea } from '@styleguide'

interface CandidatePositionStatementProps {
  candidatePosition?: string
  setCandidatePosition?: (value: string) => void
}

export const CandidatePositionStatement = ({
  candidatePosition = '',
  setCandidatePosition = noop,
}: CandidatePositionStatementProps): React.JSX.Element => (
  <div className="flex flex-col gap-1.5 w-full">
    <Label htmlFor="candidate-position">Your Position</Label>
    <Textarea
      id="candidate-position"
      placeholder="Write 1 or 2 sentences about your position on this issue…"
      rows={3}
      value={candidatePosition}
      onChange={(e) => {
        setCandidatePosition(e.target.value)
      }}
    />
  </div>
)
