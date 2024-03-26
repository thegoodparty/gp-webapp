import Link from 'next/link';
import { MdOutlineCheck } from 'react-icons/md';

export default function ResidentsSection(props) {
  const { route } = props;
  const addresses = route.data?.optimizedAddresses || [];

  return (
    <div className="mt-6">
      {addresses.map((address) => (
        <Link
          href={`/volunteer-dashboard/door-knocking/route/${route.id}/address/${address.voterId}`}
          key={address.voterId}
        >
          <div className=" p-4 rounded-lg border bg-white  mb-4 border-slate-300 flex items-center justify-between">
            <div>{address.address}</div>
            {address.status === 'completed' ? (
              <div className="bg-green-50 text-green-700  p-2 rounded flex items-center font-medium">
                <MdOutlineCheck />
                <div className="ml-1 text-xs ">COMPLETED</div>
              </div>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
