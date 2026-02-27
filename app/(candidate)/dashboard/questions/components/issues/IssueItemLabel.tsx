interface IssueItemLabelProps {
  name: string
  numPositions?: number
}

export const IssueItemLabel = ({
  name,
  numPositions,
}: IssueItemLabelProps): React.JSX.Element => (
  <div className="font-medium">
    {name} ({numPositions || 0})
  </div>
)
