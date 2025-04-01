import H4 from '@shared/typography/H4';

export const RemainingTasks = ({ numOfRemainingTasks = 0 }) => (
  <H4>
    You have <strong className="underline">{numOfRemainingTasks} tasks</strong>{' '}
    you need to complete.
  </H4>
);
