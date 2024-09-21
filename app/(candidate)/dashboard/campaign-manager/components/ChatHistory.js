import Button from '@shared/buttons/Button';
import { MdMenu } from 'react-icons/md';

export default function ChatHistory() {
  return (
    <div className="flex justify-end">
      <Button variant="text">
        <div className="flex items-center">
          <MdMenu />
          <div className="ml-2">View Chat History</div>
        </div>
      </Button>
    </div>
  );
}
