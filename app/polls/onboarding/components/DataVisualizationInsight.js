import { Card, CardContent } from 'goodparty-styleguide'
import { LuChartLine } from 'react-icons/lu'
import { InsightPieChart, InsightDonutChart, InsightHorizontalGaugeChart, InsightVerticalBarChart, InsightHorizontalBarChart } from '@shared/charts'

export const DataVisualizationInsight = ({ title, data, insight, chartType, percentage, isLoading, error }) => {
    const hasData = Array.isArray(data) && data.length > 0

    const LoadingSkeleton = () => {
        
            return (
                <div className="w-full h-60 rounded-md bg-slate-50 border border-slate-200 px-4 py-3 flex items-center justify-center">
                    <div className="h-full flex items-end gap-2">
                        <div className="w-6 bg-slate-200 animate-pulse rounded" style={{ height: '30%' }} />
                        <div className="w-6 bg-slate-200 animate-pulse rounded" style={{ height: '55%' }} />
                        <div className="w-6 bg-slate-200 animate-pulse rounded" style={{ height: '80%' }} />
                        <div className="w-6 bg-slate-200 animate-pulse rounded" style={{ height: '45%' }} />
                        <div className="w-6 bg-slate-200 animate-pulse rounded" style={{ height: '65%' }} />
                        <div className="w-6 bg-slate-200 animate-pulse rounded" style={{ height: '35%' }} />
                    </div>
                </div>
            )
       
    }

    const MessagePlaceholder = ({ message }) => (
        <div className="w-full">
            <div className="h-48 w-full rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-sm text-muted-foreground">
                {message}
            </div>
        </div>
    )

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
                    {isLoading && <LoadingSkeleton />}
                    {!isLoading && error && (
                        <MessagePlaceholder message={`Unable to load chart data${error ? `: ${error}` : ''}`} />
                    )}
                    {!isLoading && !error && !hasData && (
                        <MessagePlaceholder message="No data available for this chart" />
                    )}
                    {!isLoading && !error && hasData && (
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
                    isLoading ? (
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


