import { BsThreeDotsVertical } from 'react-icons/bs'
import DeleteAction from './DeleteAction'
import { KeyboardEvent } from 'react'

interface ActionsProps {
  id: string
  showMenu: string | number | boolean
  setShowMenu: (value: string | number | boolean) => void
  deleteHistoryCallBack: (id: string) => Promise<void>
  actionName: string
}

export default function Actions({
  id,
  showMenu,
  setShowMenu,
  deleteHistoryCallBack,
  actionName,
}: ActionsProps): React.JSX.Element {
  const handleKeyDown = (e: KeyboardEvent, id: string) => {
    const isEnterOrSpace = e.key === 'Enter' || e.key === ' '
    const isEsc = e.key === 'Escape'

    if (!showMenu && isEnterOrSpace) {
      setShowMenu(id)
    } else if (showMenu && (isEnterOrSpace || isEsc)) {
      setShowMenu(false)
    }
  }
  return (
    <div className="relative">
      <BsThreeDotsVertical
        role="button"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, id)}
        onClick={() => {
          setShowMenu(id)
        }}
      />
      {showMenu === id && (
        <div
          onClick={() => {
            setShowMenu(false)
          }}
          onKeyDown={(e) => handleKeyDown(e, id)}
          tabIndex={0}
          role="button"
          className="absolute right-0 z-40 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
        >
          <DeleteAction
            id={id}
            deleteHistoryCallBack={deleteHistoryCallBack}
            actionName={actionName}
          />
        </div>
      )}
    </div>
  )
}
