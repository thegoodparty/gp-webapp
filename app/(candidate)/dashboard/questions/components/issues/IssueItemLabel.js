export const IssueItemLabel = ({ name, numPositions }) => (
  <div className="font-medium">
    {name} ({numPositions || 0})
  </div>
)
