import Tag from '@shared/utils/Tag';
import { GiJumpAcross } from 'react-icons/gi';
import { MdOutlineCheck } from 'react-icons/md';
import { TbProgressCheck } from 'react-icons/tb';

export default function AddressStatusTag({ address }) {
  return (
    <>
      {address.status === 'completed' ? (
        <Tag
          className="bg-green-50 text-green-700"
          icon={<MdOutlineCheck />}
          label="COMPLETED"
        />
      ) : null}
      {address.status === 'in-progress' ? (
        <Tag
          className="bg-orange-50 text-orange-700"
          icon={<TbProgressCheck />}
          label="IN PROGRESS"
        />
      ) : null}

      {address.status === 'skipped' ? (
        <Tag
          className="bg-yellow-50 text-indigo-500"
          icon={<GiJumpAcross />}
          label="SKIPPED"
        />
      ) : null}
    </>
  );
}
