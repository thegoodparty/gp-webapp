import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import Chip from '@shared/utils/Chip';
import AddressStatusTag from 'app/(volunteer)/volunteer-dashboard/door-knocking/[dkslug]/route/[id]/components/AddressStatusTag';
import { dateUsHelper } from 'helpers/dateHelper';
import { MdOutlineCheck } from 'react-icons/md';
import Link from 'next/link';

export default function ResidentsSection({ dkCampaign, route }) {
  const { name, slug } = dkCampaign;
  const addresses = route.data?.optimizedAddresses || [];
  const claimed = route.claimedByUser;

  const Wrapper = ({ children, address }) => {
    if (address.status === 'completed') {
      return <div>{children}</div>;
    }
    if (claimed) {
      return (
        <Link
          href={`/volunteer-dashboard/door-knocking/${slug}/route/${route.id}/address/${address.voterId}`}
          className="block cursor-pointer no-underline bg-white transition-colors hover:bg-green-200 rounded-lg"
        >
          {children}
        </Link>
      );
    }
    return <div>{children}</div>;
  };
  return (
    <div className="mt-6">
      <Paper>
        <H2>{name} Residents</H2>
        <Body2 className="mb-6">something here.</Body2>
        <div className="grid grid-cols-12 gap-4">
          {addresses.map((address) => (
            <div
              className=" col-span-12 md:col-span-6 lg:col-span-4 "
              key={address.voterId}
            >
              <Wrapper address={address}>
                <div
                  className="p-4 rounded-lg border border-slate-300 flex items-center justify-between"
                  key={address.voterId}
                >
                  <div>{address.address}</div>
                  <AddressStatusTag address={address} />
                </div>
              </Wrapper>
            </div>
          ))}
        </div>
      </Paper>
    </div>
  );
}
