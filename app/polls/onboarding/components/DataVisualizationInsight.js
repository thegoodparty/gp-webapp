import { Card, CardContent } from 'goodparty-styleguide'
import { LuChartLine } from 'react-icons/lu'
import { InsightPieChart, InsightDonutChart, InsightHorizontalGaugeChart, InsightVerticalBarChart, InsightHorizontalBarChart, ChartSkeleton } from '@shared/charts'

const MessageFallback = ({ message }) => (
    <div className="w-full">
        <div className="h-48 w-full rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-sm text-muted-foreground">
            {message}
        </div>
    </div>
)

export const DataVisualizationInsight = ({ title, data, insight, chartType, percentage, isLoading, error }) => {
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
                <div className="w-full h-auto">
                    {showSkeleton && <ChartSkeleton />}
                    {showError && <MessageFallback message="Unable to load chart data" />}
                    {showEmpty && <MessageFallback message="No data available for this chart" />}
                    {showChart && (
                        <>
                            {chartType === 'pie' && <InsightPieChart data={data} percentage={percentage} />}
                            {chartType === 'donut' && <InsightDonutChart data={data} percentage={percentage} />}
                            {chartType === 'horizontalGauge' && <InsightHorizontalGaugeChart data={data} percentage={percentage} />}
                            {chartType === 'verticalBar' && <InsightVerticalBarChart data={data} percentage={percentage} />}
                            {chartType === 'horizontalBar' && <InsightHorizontalBarChart data={data} percentage={percentage} />}
                        </>
                    )}
                </div>
                {insight && (
                    showSkeleton ? (
                        <div className="border-t border-slate-200 pt-4 mt-4 space-y-2">
                            <div className="h-3 w-5/6 rounded bg-slate-100 animate-pulse" />
                        </div>
                    ) : (
                        <p className="text-xs font-normal text-muted-foreground border-t border-slate-200 pt-4 mt-4">{insight}</p>
                    )
                )}
            </CardContent>
        </Card>
    )
}


