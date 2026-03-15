import { noop } from '@shared/utils/noop'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'

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
    <PrimaryButton disabled={disableSave} onClick={onSave}>
      {editIssuePosition ? 'Save' : 'Next'}
    </PrimaryButton>
    {editIssuePosition && (
      <SecondaryButton className="ml-2" variant="outlined" onClick={onCancel}>
        Cancel
      </SecondaryButton>
    )}
  </>
)
