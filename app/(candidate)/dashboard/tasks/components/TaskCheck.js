import {
  CheckCircleOutlineRounded,
  CircleOutlined,
  TaskAltRounded,
} from '@mui/icons-material'

export default function TaskCheck({ checked, onClick }) {
  const handleClick = () => {
    if (!checked) {
      onClick()
    }
  }

  return (
    <span onClick={handleClick} className="group cursor-pointer">
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
