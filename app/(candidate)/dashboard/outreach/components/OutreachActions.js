import { MdContentCopy, MdDownload } from 'react-icons/md'

export const OUTREACH_ACTION_TYPES = {
  COPY_SCRIPT: 'COPY_SCRIPT',
  DOWNLOAD_LIST: 'DOWNLOAD_LIST',
}

const ACTIONS = [
  {
    type: OUTREACH_ACTION_TYPES.COPY_SCRIPT,
    label: (
      <>
        <MdContentCopy className="mr-2" />
        Copy Script
      </>
    ),
  },
  {
    type: OUTREACH_ACTION_TYPES.DOWNLOAD_LIST,
    label: (
      <>
        <MdDownload className="mr-2" />
        Download list
      </>
    ),
  },
]

export const OutreachActions = ({ outreach, onClick = () => {} }) => {
  return (
    <div className="flex flex-col space-y-2">
      {ACTIONS.map((action) => (
        <div
          key={action.type}
          onClick={(e) => {
            e.stopPropagation()
            onClick(outreach, action.type)
          }}
          className="flex items-center space-x-2 p-4 hover:bg-gray-100 cursor-pointer"
        >
          {action.label}
        </div>
      ))}
    </div>
  )
}
