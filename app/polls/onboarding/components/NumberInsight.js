import { Card, CardContent } from 'goodparty-styleguide'
import { numberFormatter } from 'helpers/numberHelper'

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


