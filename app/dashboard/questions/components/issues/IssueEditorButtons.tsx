import { noop } from '@shared/utils/noop'
import { Button } from '@styleguide'

interface IssueEditorButtonsProps {
  disableSave?: boolean
  editIssuePosition?: boolean
  onSave?: () => void
  onCancel?: () => void
}

export const IssueEditorButtons = ({
  disableSave = false,
  editIssuePosition,
  onSave = noop,
  onCancel = noop,
}: IssueEditorButtonsProps): React.JSX.Element => (
  <>
    <Button disabled={disableSave} onClick={onSave}>
      {editIssuePosition ? 'Save' : 'Next'}
    </Button>
    {editIssuePosition && (
      <Button className="ml-2" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    )}
  </>
)
