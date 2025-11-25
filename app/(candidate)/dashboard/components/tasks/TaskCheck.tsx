import {
  CheckCircleOutlineRounded,
  CircleOutlined,
  TaskAltRounded,
} from '@mui/icons-material'

interface TaskCheckProps {
  checked: boolean
  onClick: () => void
  trackingAttrs?: Record<string, string>
}

export default function TaskCheck({ checked, onClick, trackingAttrs }: TaskCheckProps): React.JSX.Element {
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
          <CircleOutlined className="group-hover:hidden" />
          <CheckCircleOutlineRounded className="!hidden group-hover:!inline" />
        </>
      ) : (
        <TaskAltRounded className="text-indigo-400" />
      )}
    </span>
  )
}
