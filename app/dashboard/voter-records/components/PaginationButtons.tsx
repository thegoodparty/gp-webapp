import { Button } from '@styleguide'
import { LoaderCircleIcon } from '@styleguide/components/ui/icons'

interface PaginationButtonsProps {
  currentPage: number
  totalPages: number | null
  onPageChange: (page: number) => void
  loading?: boolean
  className?: string
}

export default function PaginationButtons({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  className = '',
}: PaginationButtonsProps): React.JSX.Element {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {loading && <LoaderCircleIcon className="size-5 animate-spin" />}
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="secondary"
        size="small"
      >
        Previous
      </Button>
      <span className="text-gray-600 text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="secondary"
        size="small"
      >
        Next
      </Button>
    </div>
  )
}
