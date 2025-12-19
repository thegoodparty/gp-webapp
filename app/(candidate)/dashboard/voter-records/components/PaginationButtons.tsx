import { CircularProgress } from '@mui/material'
import Button from '@shared/buttons/Button'

interface PaginationButtonsProps {
  currentPage: number
  totalPages: number
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
      {loading && <CircularProgress size={20} />}
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        color="neutral"
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
        color="neutral"
        size="small"
      >
        Next
      </Button>
    </div>
  )
}






