import MaxWidth from '@shared/layouts/MaxWidth'
import Paper from '@shared/utils/Paper'

export default function CardPageWrapper({ children }) {
  return (
    <div className="bg-indigo-100 min-h-[calc(100vh-60px)]">
      <MaxWidth>
        <div className="flex items-center justify-center">
          <div className="grid py-6 max-w-2xl w-[85vw]">
            <Paper>
              <div className="p-4 md:p-6 lg:p-8">{children}</div>
            </Paper>
          </div>
        </div>
      </MaxWidth>
    </div>
  )
}
