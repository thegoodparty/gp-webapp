import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';
import FollowButton from './FollowButton';
import MoreCTAs from './MoreCTAs';

export default function CtaSection(props) {
  const { color, textColor, editMode, candidate } = props;
  return (
    <div className="flex justify-center lg:justify-end items-center">
      {editMode ? (
        <Link href={`/candidate/${candidate.slug}`}>
          <WarningButton
            style={{ backgroundColor: color, color: textColor }}
            size="medium"
          >
            <span className="font-medium">Done Editing</span>
          </WarningButton>
        </Link>
      ) : (
        <>
          <Link href="/volunteer" id="candidate-volunteer" className="mr-1">
            <WarningButton
              style={{ backgroundColor: color, color: textColor }}
              size="medium"
            >
              <span className="font-medium">Volunteer</span>
            </WarningButton>
          </Link>
          <div className="mr-1">
            <FollowButton {...props} />
          </div>
          <div>
            <MoreCTAs {...props} />
          </div>
        </>
      )}
    </div>
  );
}
