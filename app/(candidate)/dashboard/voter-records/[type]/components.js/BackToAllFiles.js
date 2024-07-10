import PrimaryButton from '@shared/buttons/PrimaryButton';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';

export default function BackToAllFiles(props) {
  return (
    <Link href="/dashboard/voter-records">
      <PrimaryButton fullWidth>
        <div className="flex items-center">
          <FaChevronLeft />
          <div className="ml-2">Back to All Voter Files</div>
        </div>
      </PrimaryButton>
    </Link>
  );
}
