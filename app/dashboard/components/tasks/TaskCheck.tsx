import { Circle, CircleCheck } from 'lucide-react'

interface TaskCheckProps {
  checked: boolean
  onClick: () => void
  trackingAttrs?: Record<string, string>
}

const TaskCheck = ({
  checked,
  onClick,
  trackingAttrs,
}: TaskCheckProps): React.JSX.Element => {
  const handleClick = () => {
    if (!checked) {
      onClick()
    }
  }

  return (
    <span
      onClick={handleClick}
      className="group cursor-pointer"
      {...trackingAttrs}
    >
      {!checked ? (
        <>
          <Circle className="group-hover:hidden!" />
          <CircleCheck className="hidden! group-hover:inline!" />
        </>
      ) : (
        <CircleCheck className="text-indigo-400" />
      )}
    </span>
  )
}

export default TaskCheck
