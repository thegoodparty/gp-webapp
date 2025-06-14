import { CopyScriptActionOption } from 'app/(candidate)/dashboard/outreach/components/CopyScriptActionOption'
import { DownloadAudienceActionOption } from 'app/(candidate)/dashboard/outreach/components/DownloadAudienceActionOption'

export const OutreachActions = ({ outreach, onClick = () => {} }) => (
  <div className="flex flex-col space-y-2">
    <CopyScriptActionOption
      {...{
        outreach,
        onCopy: () => onClick(),
      }}
      outreach={outreach}
      onClick={onClick}
    />
    <DownloadAudienceActionOption
      {...{
        outreach,
        onClick: onClick,
        disabled: !outreach?.voterFileFilter,
      }}
    />
  </div>
)
