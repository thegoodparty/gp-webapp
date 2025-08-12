import RerunP2V from './RerunP2V'
import { useAdminCampaign } from '@shared/hooks/useAdminCampaign'

export default function VoterFileSection() {
  const [campaign] = useAdminCampaign()

  return (
    <div className="bg-indigo-50 rounded border border-slate-300 p-4 my-12">
      <div>
        {campaign?.details?.raceId === undefined ? (
          <div className="my-4">
            This campaign is not eligible for an Automatic Path To Victory
            because the user manually selected an office.
          </div>
        ) : null}

        <strong>You can rerun path to victory, but this WILL override the district set above in the District Picker</strong>
        {campaign?.details?.raceId ? <RerunP2V /> : null}
      </div>
    </div>
  )
}
