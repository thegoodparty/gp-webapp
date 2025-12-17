import { LuMailWarning } from 'react-icons/lu'

interface ErrorMessageProps {
  title?: string
  message: string | null
  onDismiss?: () => void
  show?: boolean
}

export const ErrorMessage = ({
  title = 'Error',
  message,
  onDismiss,
  show = false,
}: ErrorMessageProps) => {
  if (!show || !message) return null

  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <LuMailWarning className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2">
            <p className="text-sm text-red-700 font-normal">{message}</p>
          </div>
          {onDismiss && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  onClick={onDismiss}
                  className="bg-red-50 px-2 py-1.5 rounded-md text-sm text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
