import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import clsx from 'clsx'
import H5 from '@shared/typography/H5'
import { OutreachImpact } from 'app/(candidate)/dashboard/outreach/components/OutreachImpact'

export default function OutreachCreateCard({
  type,
  title,
  impact,
  cost,
  selected,
  onClick,
}) {
  return (
    <Card
      onClick={() => onClick(type)}
      className={clsx(
        'flex flex-col justify-between cursor-pointer transition-shadow w-full shadow-md hover:shadow-lg border border-transparent bg-white',
        selected && 'border-blue-500 outline outline-2 outline-blue-300',
      )}
      sx={{ borderRadius: 3, p: 0, boxShadow: 2 }}
      elevation={0}
    >
      <CardContent className="flex flex-col gap-2 p-3 !pb-3">
        <div className="flex items-center justify-between mb-2">
          <H5>{title}</H5>
          <ArrowForwardIcon className="mr-[-6px]" />
        </div>
        <div className="flex items-center justify-between">
          <OutreachImpact impact={impact} />
          <span className="text-gray-700 text-xs">{cost}</span>
        </div>
      </CardContent>
    </Card>
  )
}
