import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import clsx from 'clsx'
import H5 from '@shared/typography/H5'
import { OutreachImpact } from 'app/(candidate)/dashboard/outreach/components/OutreachImpact'
import { useCampaign } from '@shared/hooks/useCampaign'
import { MdLockOutline } from 'react-icons/md'
import { OUTREACH_TYPES } from '../constants'
import { useP2pUxEnabled } from 'app/(candidate)/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider'

type OutreachType = 'text' | 'p2p' | 'robocall' | 'doorKnocking' | 'phoneBanking' | 'socialMedia'

interface OutreachCreateCardProps {
  type: OutreachType
  title: string
  impact: 'low' | 'medium' | 'high'
  cost: number
  selected?: boolean
  onClick: (type: OutreachType) => void
  requiresPro?: boolean
}

const formatCost = (cost: number): string =>
  cost === 0 ? 'Free' : `$${cost.toFixed(3).replace(/^0\./, '.')}\/msg`

export const OutreachCreateCard = ({
  type,
  title,
  impact,
  cost,
  selected,
  onClick,
  requiresPro = false,
}: OutreachCreateCardProps) => {
  const [campaign] = useCampaign()
  const { p2pUxEnabled } = useP2pUxEnabled()
  const { isPro, hasFreeTextsOffer } = campaign || {}
  
  const isTextType = type === OUTREACH_TYPES.text || type === OUTREACH_TYPES.p2p
  const showFreeOffer = p2pUxEnabled && isTextType && hasFreeTextsOffer
  
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
          {requiresPro && !isPro ? (
            <MdLockOutline />
          ) : (
            <ArrowForwardIcon className="mr-[-6px]" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <OutreachImpact impact={impact} />
          <span className="text-gray-700 text-xs">
            {showFreeOffer ? '5,000 Free' : formatCost(cost)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
