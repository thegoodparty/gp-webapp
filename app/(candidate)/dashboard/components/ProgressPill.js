import Caption from '@shared/typography/Caption';
import { calculateAccumulated, calculateOnTrack } from './voterGoalsHelpers';

export default function ProgressPill(props) {
  const { contactGoals, weeksUntil, reportedVoterGoals } = props;
  const { doorsOnTrack, callsOnTrack, digitalOnTrack } = calculateOnTrack({
    contactGoals,
    weeksUntil,
    reportedVoterGoals,
  });
  if (weeksUntil?.weeks > 11) {
    return null;
  }

  if (doorsOnTrack && callsOnTrack && digitalOnTrack) {
    return (
      <div className="absolute  top-5 right-5 bg-green-200 text-indigo-900 rounded-full py-1 px-2">
        <Caption>On track</Caption>
      </div>
    );
  }
  let focusArea = '';
  if (!doorsOnTrack && !callsOnTrack && !digitalOnTrack) {
    focusArea = 'all';
  } else {
    if (!doorsOnTrack) {
      focusArea = 'door knocking';
    }
    if (!callsOnTrack) {
      if (focusArea !== '') {
        focusArea += ' and ';
      }
      focusArea += 'calls';
    }

    if (!digitalOnTrack) {
      if (focusArea !== '') {
        focusArea += ' and ';
      }
      focusArea += 'online impressions';
    }
  }
  return (
    <div className="absolute top-5 right-5 bg-red-400 text-slate-50 rounded-full py-1 px-2">
      <Caption>Focus on {focusArea}</Caption>
    </div>
  );
}
