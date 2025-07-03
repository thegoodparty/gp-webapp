import { CopyScriptActionOption } from 'app/(candidate)/dashboard/outreach/components/CopyScriptActionOption'
import { DownloadAudienceActionOption } from 'app/(candidate)/dashboard/outreach/components/DownloadAudienceActionOption'
import { OUTREACH_ACTIONS_TYPES } from 'app/(candidate)/dashboard/outreach/constants'

export const OutreachActions = ({ outreach, onClick = (action) => {} }) => (
  <div className="flex flex-col space-y-2">
    <CopyScriptActionOption
      {...{
        outreach,
        onCopy: () => onClick(OUTREACH_ACTIONS_TYPES.copyScript),
      }}
      outreach={outreach}
      onClick={onClick}
    />
    <DownloadAudienceActionOption
      {...{
        outreach,
        onClick: () => onClick(OUTREACH_ACTIONS_TYPES.downloadAudience),
        disabled: !outreach?.voterFileFilter,
      }}
    />
  </div>
)
