import { Card, CardContent } from 'goodparty-styleguide'
import { numberFormatter } from 'helpers/numberHelper'

export const NumberInsight = ({ title, value, icon, isLoading = false, error }) => {
    return (
        <Card className="w-full">
            <CardContent>
                <div className="flex items-center justify-between">
                    <p>{title}</p>
                    <div className="text-lg text-slate-600 ">
                        {icon}
                    </div>
                </div>
                {isLoading && (
                    <div className="mt-3 h-8 w-40 rounded bg-slate-100 animate-pulse" />
                )}
                {!isLoading && error && (
                    <p className="text-sm text-muted-foreground mt-2">Unable to load value</p>
                )}
                {!isLoading && !error && (
                    <p className="text-2xl leading-normal font-bold mt-2">{numberFormatter(value)}</p>
                )}
            </CardContent>
        </Card>
    )
}


