import Button from '@shared/buttons/Button'
import Link from 'next/link'
import { FaPlus } from 'react-icons/fa'

export default function AddIssueButton() {
  return (
    <Link href="/dashboard/issues/add-issue">
      <Button color="info">
        <div className="flex items-center gap-2">
          <FaPlus />
          Add an issue
        </div>
      </Button>
    </Link>
  )
}
