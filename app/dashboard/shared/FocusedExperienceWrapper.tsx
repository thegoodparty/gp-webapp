import { Paper } from '@mui/material'

interface FocusedExperienceWrapperProps {
  className?: string
  children: React.ReactNode
  [key: string]: string | boolean | number | React.ReactNode | undefined
}

export const FocusedExperienceWrapper = ({
  className = '',
  children,
  ...restProps
}: FocusedExperienceWrapperProps): React.JSX.Element => (
  <div className="w-full px-4 bg-indigo-100">
    <div className="min-h-[calc(100vh-60px)] py-20 w-full">
      <div className="max-w-screen-sm mx-auto">
        <Paper
          className={`p-6 md:p-16 rounded-2xl border border-indigo-200 ${className}`}
          elevation={0}
          {...restProps}
        >
          {children}
        </Paper>
      </div>
    </div>
  </div>
)
