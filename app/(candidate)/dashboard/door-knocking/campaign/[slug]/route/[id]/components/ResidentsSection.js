import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import Chip from '@shared/utils/Chip';
import AddressStatusTag from 'app/(volunteer)/volunteer-dashboard/door-knocking/[dkslug]/route/[id]/components/AddressStatusTag';
import { dateUsHelper } from 'helpers/dateHelper';
import { MdOutlineCheck } from 'react-icons/md';

export default function ResidentsSection({ dkCampaign, route }) {
  const { name } = dkCampaign;
  const addresses = route.data?.optimizedAddresses || [];
  return (
    <div className="mt-6">
      <Paper>
        <H2>{name} Residents</H2>
        <Body2 className="mb-6">something here.</Body2>
        <div className="grid grid-cols-12 gap-4">
          {addresses.map((address) => (
            <div
              className=" col-span-12 md:col-span-6 lg:col-span-4 p-4 rounded-lg border border-slate-300 flex items-center justify-between"
              key={address.voterId}
            >
              <div>{address.address}</div>
              <AddressStatusTag address={address} />
            </div>
          ))}
        </div>
      </Paper>
    </div>
  );
}
