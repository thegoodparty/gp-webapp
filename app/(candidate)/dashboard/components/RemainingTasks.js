import H4 from '@shared/typography/H4'

export const RemainingTasks = ({ numOfRemainingTasks = 0 }) => (
  <H4 className="mb-6">
    You have <span className="font-bold">{numOfRemainingTasks} tasks</span> you
    need to complete.
  </H4>
)
