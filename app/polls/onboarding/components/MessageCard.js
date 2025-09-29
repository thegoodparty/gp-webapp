import { Card, CardContent } from 'goodparty-styleguide'
import { LuInbox } from "react-icons/lu"

export const MessageCard = ({ title, description, icon, note }) => {
    return (
        <Card className="w-full">
            <CardContent>
                <div className="flex items-center">
                    <div className="mr-2 text-xl w-5 h-5">
                        {icon ?? <LuInbox/>}
                    </div>
                    <p className="font-semibold">{title}</p>
                </div>
                <div>{description}</div>
                <p className="text-xs font-normal text-muted-foreground border-t border-slate-200 pt-4 mt-4">{note}</p>
            </CardContent>
        </Card>
    )
}
