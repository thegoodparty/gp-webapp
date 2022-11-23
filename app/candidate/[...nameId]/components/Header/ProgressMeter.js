import CandidateProgressBar from '@shared/candidates/CandidateProgressBar';

import styles from './ProgressMeter.module.scss';

export default function ProgressMeter({ candidate, followers }) {
  const offsetFollow = 0;
  let thisWeek = offsetFollow;
  if (followers) {
    thisWeek = followers.thisWeek + offsetFollow;
  }

  return (
    <div className="lg:flex lg:justify-end">
      <div className={`text-sm lg:text-xl ${styles.innerWrapper}`}>
        <CandidateProgressBar
          candidate={candidate}
          peopleSoFar={thisWeek || 0}
          withAchievement
        />
      </div>
    </div>
  );
}
