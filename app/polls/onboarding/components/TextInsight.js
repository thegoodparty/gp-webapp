import { Card, CardContent } from 'goodparty-styleguide'
import { LuLightbulb } from 'react-icons/lu'

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


