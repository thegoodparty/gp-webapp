import { Card, CardContent } from 'goodparty-styleguide'
import { LuChartLine } from 'react-icons/lu'
import { InsightPieChart, InsightDonutChart, InsightHorizontalGaugeChart, InsightVerticalBarChart, InsightHorizontalBarChart } from '@shared/charts'

export const DataVisualizationInsight = ({ title, data, insight, chartType, percentage }) => {
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
                    {chartType === 'pie' && <InsightPieChart data={data} percentage={percentage} />}
                    {chartType === 'donut' && <InsightDonutChart data={data} percentage={percentage} />}
                    {chartType === 'horizontalGauge' && <InsightHorizontalGaugeChart data={data} percentage={percentage} />}
                    {chartType === 'verticalBar' && <InsightVerticalBarChart data={data} percentage={percentage} />}
                    {chartType === 'horizontalBar' && <InsightHorizontalBarChart data={data} percentage={percentage} />}
                </div>
                {insight && <p className="text-xs font-normal text-muted-foreground border-t border-slate-200 pt-4 mt-4">{insight}</p>}
            </CardContent>
        </Card>
    )
}


