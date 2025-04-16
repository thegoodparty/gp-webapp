import H4 from '@shared/typography/H4'

export const RemainingTasks = ({ numOfRemainingTasks = 0 }) => (
  <H4 className="mb-6">
    You have <strong>{numOfRemainingTasks} tasks</strong> you need to complete.
  </H4>
)
