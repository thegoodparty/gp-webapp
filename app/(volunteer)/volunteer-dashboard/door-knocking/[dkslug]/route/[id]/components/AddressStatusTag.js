import Chip from '@shared/utils/Chip';
import { GiJumpAcross } from 'react-icons/gi';
import { MdOutlineCheck } from 'react-icons/md';
import { TbProgressCheck } from 'react-icons/tb';

export default function AddressStatusTag({ address }) {
  console.log('address', address);
  return (
    <>
      {address.status === 'completed' ? (
        <Chip
          className="bg-green-50 text-green-700"
          icon={<MdOutlineCheck />}
          label="COMPLETED"
        />
      ) : null}
      {address.status === 'in-progress' ? (
        <Chip
          className="bg-orange-50 text-orange-700"
          icon={<TbProgressCheck />}
          label="IN PROGRESS"
        />
      ) : null}

      {address.status === 'skipped' ? (
        <Chip
          className="bg-yellow-50 text-indigo-500"
          icon={<GiJumpAcross />}
          label="SKIPPED"
        />
      ) : null}
    </>
  );
}
