import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'

export const IssueEditorButtons = ({
  disableSave = false,
  editIssuePosition,
  onSave = () => {},
  onCancel = () => {},
}) => (
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
