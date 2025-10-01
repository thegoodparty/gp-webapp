import { Card, CardContent } from 'goodparty-styleguide'
import { LuLightbulb } from 'react-icons/lu'

export const TextInsight = ({ title, description, isLoading = false, error }) => {
    return (
        <Card className="w-full">
            <CardContent>
                <div className="flex items-start justify-between">
                    {isLoading ? (
                        <div className="h-4 w-56 rounded bg-slate-100 animate-pulse" />
                    ) : (
                        <p>{title}</p>
                    )}
                    <div className="mt-1 ml-2">
                        <LuLightbulb className="text-xl font-bold" />
                    </div>
                </div>
                {isLoading && (
                    <div className="border-t border-slate-200 pt-4 mt-4 space-y-2">
                        <div className="h-3 w-5/6 rounded bg-slate-100 animate-pulse" />
                        <div className="h-3 w-4/6 rounded bg-slate-100 animate-pulse" />
                        <div className="h-3 w-3/6 rounded bg-slate-100 animate-pulse" />
                    </div>
                )}
                {!isLoading && error && (
                    <p className="text-xs font-normal text-muted-foreground border-t border-slate-200 pt-4 mt-4">Unable to load insight</p>
                )}
                {!isLoading && !error && (
                    <p className="text-xs font-normal text-muted-foreground border-t border-slate-200 pt-4 mt-4">{description}</p>
                )}
            </CardContent>
        </Card>
    )
}


