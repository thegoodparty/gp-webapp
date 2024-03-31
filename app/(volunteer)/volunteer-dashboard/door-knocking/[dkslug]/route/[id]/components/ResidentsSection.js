import Tag from '@shared/utils/Tag';
import Link from 'next/link';
import { GiJumpAcross } from 'react-icons/gi';
import { MdOutlineCheck } from 'react-icons/md';
import { TbProgressCheck } from 'react-icons/tb';

export default function ResidentsSection(props) {
  const { route, dkSlug } = props;
  const addresses = route.data?.optimizedAddresses || [];
  const claimed = route.claimedByUser;

  const Wrapper = ({ children, address }) => {
    if (address.status === 'completed') {
      return <div>{children}</div>;
    }
    if (claimed) {
      return (
        <Link
          href={`/volunteer-dashboard/door-knocking/${dkSlug}/route/${route.id}/address/${address.voterId}`}
        >
          {children}
        </Link>
      );
    }
    return <div>{children}</div>;
  };

  return (
    <div className="mt-6">
      {addresses.map((address) => (
        <Wrapper address={address} key={address.voterId}>
          {console.log('status', address.status)}
          <div className=" p-4 rounded-lg border bg-white  mb-4 border-slate-300">
            <div className="mb-2">{address.address}</div>
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
          </div>
        </Wrapper>
      ))}
    </div>
  );
}
