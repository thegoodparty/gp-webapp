'use client'
import { Card, CardContent } from 'goodparty-styleguide'
import { LuLightbulb, LuChartLine } from 'react-icons/lu'
import { numberFormatter } from 'helpers/numberHelper'
import { InsightPieChart, InsightDonutChart, InsightHorizontalGaugeChart, InsightVerticalBarChart, InsightHorizontalBarChart } from '@shared/charts'

export const TextInsight = ({ title, description }) => {
    return (
        <Card className="w-full">
            <CardContent>
                <div className="flex items-start justify-between">
                    <p>{title}</p>
                    <div className="mt-1 ml-2">
                        <LuLightbulb className="text-xl font-bold" />
                    </div>
                </div>
                <p className="text-xs font-normal text-muted-foreground border-t border-slate-200 pt-4 mt-4">{description}</p>
            </CardContent>
        </Card>
    )
}

export const NumberInsight = ({ title, value, icon }) => {
    return (
        <Card className="w-full">
            <CardContent>
                <div className="flex items-center justify-between">
                    <p>{title}</p>
                    <div className="text-lg text-slate-600 ">
                        {icon}
                    </div>
                </div>
                <p className="text-2xl leading-normal font-bold mt-2">{numberFormatter(value)}</p>
            </CardContent>
        </Card>
    )
}

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