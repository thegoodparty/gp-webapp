import Link from 'next/link';
import { IoIosArrowRoundForward } from 'react-icons/io';

export default function GetStartedCTA() {
  return (
    <Link href="/login" className=" flex items-center underline text-lg">
      <div>Get Started</div>
      <IoIosArrowRoundForward className="ml-1" size={28} />
    </Link>
  );
}
