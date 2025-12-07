import H4 from '@shared/typography/H4'

interface RemainingTasksProps {
  numOfRemainingTasks?: number
}

export const RemainingTasks = ({ numOfRemainingTasks = 0 }: RemainingTasksProps): React.JSX.Element => (
  <H4 className="mb-6">
    You have <span className="font-bold">{numOfRemainingTasks} tasks</span> you
    need to complete.
  </H4>
)


