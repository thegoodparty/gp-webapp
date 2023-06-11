import SecondaryButton from '@shared/buttons/SecondaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';
import { AiOutlineCaretDown } from 'react-icons/ai';
import FollowButton from './FollowButton';

export default function CtaSection(props) {
  const { color, textColor } = props;
  return (
    <div className="flex justify-center lg:justify-end items-center">
      <Link href="/volunteer" id="candidate-volunteer" className="mr-1">
        <WarningButton style={{ backgroundColor: color, color: textColor }}>
          <span className="font-medium">Volunteer</span>
        </WarningButton>
      </Link>
      <div className="mr-1">
        <FollowButton {...props} />
      </div>
      <div>
        <SecondaryButton style={{ height: '60px' }}>
          <AiOutlineCaretDown size={22} />
        </SecondaryButton>
      </div>
    </div>
  );
}
