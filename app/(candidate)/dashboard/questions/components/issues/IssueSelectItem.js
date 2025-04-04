import { FaChevronRight } from 'react-icons/fa6'
import { IssueItemLabel } from './IssueItemLabel'

export const IssueSelectItem = ({
  issue = {},
  handleSelectIssue = (v) => {},
}) => (
  <div
    className={`
      flex 
      justify-between 
      items-center 
      p-4 
      rounded-lg 
      mt-2 
      cursor-pointer 
      transition-colors 
      bg-indigo-50
      hover:bg-tertiary-background
    `}
    onClick={() => {
      handleSelectIssue(issue)
    }}
  >
    <IssueItemLabel
      name={issue?.name}
      numPositions={issue?.positions?.length}
    />
    <FaChevronRight size={14} />
  </div>
)
