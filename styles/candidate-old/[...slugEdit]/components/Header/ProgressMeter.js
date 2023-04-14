import CandidateProgressBar from '@shared/candidates/CandidateProgressBar';
import FollowButton from './FollowButton';
import styles from './ProgressMeter.module.scss';

export default function ProgressMeter({ candidate, followers }) {
  let thisWeek = 0;
  if (followers) {
    thisWeek = followers.thisWeek;
  }

  return (
    <div className="mt-8 lg:mt-0 lg:flex lg:justify-end">
      <div className={`text-sm lg:text-xl ${styles.innerWrapper}`}>
        <CandidateProgressBar
          candidate={candidate}
          peopleSoFar={thisWeek || 0}
          withAchievement
        />
        <div className="lg:hidden mt-8">
          <FollowButton candidate={candidate} fullWidth />
        </div>
      </div>
    </div>
  );
}
