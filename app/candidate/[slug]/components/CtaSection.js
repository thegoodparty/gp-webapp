'use client';
import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';
import FollowButton from './FollowButton';
import MoreCTAs from './MoreCTAs';
import Sticky from 'react-stickynode';

export default function CtaSection(props) {
  const { color, textColor, editMode, candidate } = props;
  return (
    <Sticky innerZ={50}>
      <div className=" bg-slate-50 pt-5 pb-3">
        <div className="flex justify-center lg:justify-end items-center">
          {editMode ? (
            <a href={`/candidate/${candidate.slug}`}>
              <WarningButton
                style={{ backgroundColor: color, color: textColor }}
                size="medium"
              >
                <span className="font-medium">Done Editing</span>
              </WarningButton>
            </a>
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
      </div>
    </Sticky>
  );
}
