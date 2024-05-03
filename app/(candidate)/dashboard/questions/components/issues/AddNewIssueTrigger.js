import { FaCirclePlus } from 'react-icons/fa6';

export const AddNewIssueTrigger = ({ onClick }) => (
  <div
    className="p-4 rounded-lg mt-2 bg-slate-700  text-white font-semibold flex items-center cursor-pointer"
    onClick={onClick}
  >
    <FaCirclePlus />
    <div className="ml-2">Add a new issue…</div>
  </div>
);
