import Button from '@shared/buttons/Button'
import { FaPlus } from 'react-icons/fa'

export default function AddIssueButton() {
  return (
    <Button color="info" href="/dashboard/issues/add-issue">
      <div className="flex items-center gap-2">
        <FaPlus />
        Add an issue
      </div>
    </Button>
  )
}
