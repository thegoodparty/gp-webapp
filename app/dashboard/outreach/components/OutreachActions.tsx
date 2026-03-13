import { CopyScriptActionOption } from 'app/dashboard/outreach/components/CopyScriptActionOption'
import { DownloadAudienceActionOption } from 'app/dashboard/outreach/components/DownloadAudienceActionOption'
import { OUTREACH_ACTIONS_TYPES } from 'app/dashboard/outreach/constants'
import { Outreach } from 'app/dashboard/outreach/hooks/OutreachContext'

interface OutreachActionsProps {
  outreach: Outreach
  onClick?: (action: string) => void
}

export const OutreachActions = ({
  outreach,
  onClick = () => {},
}: OutreachActionsProps): React.JSX.Element => (
  <div className="flex flex-col space-y-2">
    <CopyScriptActionOption
      outreach={outreach}
      onCopy={() => onClick(OUTREACH_ACTIONS_TYPES.copyScript)}
    />
    <DownloadAudienceActionOption
      outreach={outreach}
      onClick={() => onClick(OUTREACH_ACTIONS_TYPES.downloadAudience)}
      disabled={!outreach?.voterFileFilterId}
    />
  </div>
)
