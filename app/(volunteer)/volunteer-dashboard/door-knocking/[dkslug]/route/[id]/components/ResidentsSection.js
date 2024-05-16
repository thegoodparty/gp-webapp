import Chip from '@shared/utils/Chip';
import Link from 'next/link';
import { GiJumpAcross } from 'react-icons/gi';
import { MdOutlineCheck } from 'react-icons/md';
import { TbProgressCheck } from 'react-icons/tb';
import AddressStatusTag from './AddressStatusTag';

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
          <div className=" p-4 rounded-lg border bg-white  mb-4 border-slate-300">
            <div className="mb-2">{address.address}</div>
            <AddressStatusTag address={address} />
          </div>
        </Wrapper>
      ))}
    </div>
  );
}
