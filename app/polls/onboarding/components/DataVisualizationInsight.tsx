import { BarList, Card, CardContent, DonutChart } from '@styleguide'
import { LuChartLine } from 'react-icons/lu'
import { ChartSkeleton } from '@shared/charts'

interface ChartDataPoint {
  name: string
  value: number
}

interface MessageFallbackProps {
  message: string
}

const MessageFallback = ({ message }: MessageFallbackProps) => (
  <div className="w-full">
    <div className="h-48 w-full rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  </div>
)

interface DataVisualizationInsightProps {
  title: string
  data: ChartDataPoint[]
  description?: string | null
  insight?: string | null
  chartType: 'donut' | 'barList'
  percentage?: boolean
  isLoading?: boolean
  error?: string | null
}

export const DataVisualizationInsight = ({
  title,
  data,
  description,
  insight,
  chartType,
  percentage,
  isLoading,
  error,
}: DataVisualizationInsightProps) => {
  const hasData = Array.isArray(data) && data.length > 0

  const showSkeleton = Boolean(isLoading)
  const showError = !isLoading && Boolean(error)
  const showEmpty = !isLoading && !error && !hasData
  const showChart = !isLoading && !error && hasData

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <p>{title}</p>
          <div className="text-xl text-slate-600 ">
            <LuChartLine />
          </div>
        </div>
        {description ? (
          <p className="-mt-2 mb-4 text-xs font-normal text-muted-foreground">
            {description}
          </p>
        ) : null}
        <div className="w-full h-auto">
          {showSkeleton && <ChartSkeleton />}
          {showError && <MessageFallback message="Unable to load chart data" />}
          {showEmpty && (
            <MessageFallback message="No data available for this chart" />
          )}
          {showChart && (
            <>
              {chartType === 'donut' && (
                <DonutChart data={data} percentage={percentage} />
              )}
              {chartType === 'barList' && (
                <BarList data={data} percentage={percentage} />
              )}
            </>
          )}
        </div>
        {insight &&
          (showSkeleton ? (
            <div className="border-t border-slate-200 pt-4 mt-4 space-y-2">
              <div className="h-3 w-5/6 rounded bg-slate-100 animate-pulse" />
            </div>
          ) : (
            <p className="text-xs font-normal text-muted-foreground border-t border-slate-200 pt-4 mt-4">
              {insight}
            </p>
          ))}
      </CardContent>
    </Card>
  )
}
