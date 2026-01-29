import clsx from 'clsx'
import { Card, CardContent } from '@styleguide'
import { LuInbox } from 'react-icons/lu'

export type MessageCardProps = {
  className?: string
  title: string
  description: React.ReactNode
  icon?: React.ReactNode
  note?: string
}

export const MessageCard: React.FC<MessageCardProps> = ({
  className,
  title,
  description,
  icon,
  note,
}) => {
  return (
    <Card className={clsx('w-full', className)}>
      <CardContent>
        <div className="flex items-center">
          <div className="mr-2 text-xl w-5 h-5">{icon ?? <LuInbox />}</div>
          <p className="font-semibold">{title}</p>
        </div>
        <div>{description}</div>
        {note && (
          <p className="text-xs font-normal text-muted-foreground border-t border-slate-200 pt-4 mt-4">
            {note}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
