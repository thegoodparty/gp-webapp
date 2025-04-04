import { differenceInDays } from 'date-fns/differenceInDays';
import { differenceInWeeks } from 'date-fns/differenceInWeeks';
import { subWeeks } from 'date-fns/subWeeks';
import { startOfWeek } from 'date-fns/startOfWeek';
import { addDays } from 'date-fns/addDays';
import H1 from '@shared/typography/H1';

export const DAY_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export const findPreviousWeekDay = (
  endDate,
  dayOfWeek = DAY_OF_WEEK.SUNDAY,
) => {
  const previousWeek = subWeeks(endDate, 1);
  const startOfPreviousWeek = startOfWeek(previousWeek);
  return addDays(startOfPreviousWeek, dayOfWeek);
};

const ELECTION_COUNTDOWN_UNIT = {
  WEEK: 'week',
  DAY: 'day',
};

const calculateElectionCountdownValue = (electionDate) => {
  const previousMonday = findPreviousWeekDay(electionDate, DAY_OF_WEEK.MONDAY);
  const countdownDays = differenceInDays(electionDate, previousMonday);
  const now = new Date();
  const weeksToElection = differenceInWeeks(electionDate, now);
  const daysToElection = differenceInDays(electionDate, now);

  const unit =
    daysToElection <= countdownDays
      ? ELECTION_COUNTDOWN_UNIT.DAY
      : ELECTION_COUNTDOWN_UNIT.WEEK;

  return {
    value:
      unit === ELECTION_COUNTDOWN_UNIT.DAY ? daysToElection : weeksToElection,
    unit,
  };
};

export const CampaignCountdown = ({ electionDate }) => {
  const { value, unit } = calculateElectionCountdownValue(electionDate);
  return (
    <H1 className="mb-4">{`${value} ${unit}${
      value > 1 ? 's' : ''
    } until Election Day!`}</H1>
  );
};
