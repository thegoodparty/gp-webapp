import { CircleIcon, CircleCheckIcon } from '@styleguide/components/ui/icons'

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
          <CircleIcon className="group-hover:hidden!" />
          <CircleCheckIcon className="hidden! group-hover:inline!" />
        </>
      ) : (
        <CircleCheckIcon className="text-indigo-400" />
      )}
    </span>
  )
}

export default TaskCheck
