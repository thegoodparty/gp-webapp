import Button from '@shared/buttons/Button';
import { FaChevronLeft } from 'react-icons/fa';

export default function BackToAllFiles(props) {
  return (
    <>
      <Button
        href="/dashboard/voter-records"
        size="large"
        className="w-full flex items-center"
      >
        <FaChevronLeft />
        <div className="ml-2">Back to All Voter Files</div>
      </Button>
    </>
  );
}
