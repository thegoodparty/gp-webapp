import Button from '@shared/buttons/Button'
import { FaCirclePlus } from 'react-icons/fa6'

export const AddNewIssueTrigger = ({ onClick }) => (
  <Button
    size="large"
    className="w-full mt-2 bg-slate-700  text-white font-semibold flex items-center cursor-pointer"
    onClick={onClick}
  >
    <FaCirclePlus />
    <div className="ml-2">Add a new issue…</div>
  </Button>
)
