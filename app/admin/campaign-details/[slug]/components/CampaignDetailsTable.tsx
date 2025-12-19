import { Campaign } from 'helpers/types'

interface CampaignDetailsTableProps {
  campaign: Campaign | null
}

export default function CampaignDetailsTable({
  campaign,
}: CampaignDetailsTableProps): React.JSX.Element | null {
  if (!campaign) return null

  const formatValue = (
    value: string | number | boolean | object | null | undefined | string[],
  ): React.ReactNode => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (Array.isArray(value)) return JSON.stringify(value)
    if (typeof value === 'object') {
      return (
        <div className="space-y-2 py-2">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="pl-4 border-l-2 border-gray-200">
              <span className="font-medium">{key}:</span>{' '}
              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
            </div>
          ))}
        </div>
      )
    }
    return String(value)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left border">Field</th>
            <th className="p-2 text-left border">Value</th>
          </tr>
        </thead>
        <tbody>
          {/* Base fields */}
          <tr>
            <td className="p-2 border font-semibold bg-gray-50" colSpan={2}>
              Base Fields
            </td>
          </tr>
          {Object.entries({
            id: campaign.id,
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt,
            slug: campaign.slug,
            isActive: campaign.isActive,
            isVerified: campaign.isVerified,
            isPro: campaign.isPro,
            isDemo: campaign.isDemo,
            didWin: campaign.didWin,
            dateVerified: campaign.dateVerified,
            tier: campaign.tier,
            userId: campaign.userId,
            completedTaskIds: campaign.completedTaskIds,
          }).map(([key, value]) => (
            <tr key={key}>
              <td className="p-2 border font-medium">{key}</td>
              <td className="p-2 border font-mono text-sm">
                {formatValue(value)}
              </td>
            </tr>
          ))}

          {/* Campaign Details */}
          <tr>
            <td className="p-2 border font-semibold bg-gray-50" colSpan={2}>
              Campaign Details
            </td>
          </tr>
          {Object.entries(campaign.details || {}).map(([key, value]) => (
            <tr key={key}>
              <td className="p-2 border font-medium">{key}</td>
              <td className="p-2 border font-mono text-sm">
                {formatValue(value)}
              </td>
            </tr>
          ))}

          {/* Campaign Data */}
          <tr>
            <td className="p-2 border font-semibold bg-gray-50" colSpan={2}>
              Campaign Data
            </td>
          </tr>
          {Object.entries(campaign.data || {}).map(([key, value]) => (
            <tr key={key}>
              <td className="p-2 border font-medium">{key}</td>
              <td className="p-2 border font-mono text-sm">
                {formatValue(value)}
              </td>
            </tr>
          ))}

          {/* AI Content */}
          <tr>
            <td className="p-2 border font-semibold bg-gray-50" colSpan={2}>
              AI Content
            </td>
          </tr>
          {Object.entries(campaign.aiContent || {}).map(([key, value]) => (
            <tr key={key}>
              <td className="p-2 border font-medium">{key}</td>
              <td className="p-2 border font-mono text-sm">
                {formatValue(value)}
              </td>
            </tr>
          ))}

          {/* Vendor TS Data */}
          <tr>
            <td className="p-2 border font-semibold bg-gray-50" colSpan={2}>
              Vendor TS Data
            </td>
          </tr>
          {Object.entries(campaign.vendorTsData || {}).map(([key, value]) => {
            const formatVendorValue = (): React.ReactNode => {
              if (value === null || value === undefined) return '-'
              if (typeof value === 'boolean') return value ? 'Yes' : 'No'
              if (Array.isArray(value)) return JSON.stringify(value)
              if (typeof value === 'object') {
                return (
                  <div className="space-y-2 py-2">
                    {Object.entries(value).map(([k, v]) => (
                      <div key={k} className="pl-4 border-l-2 border-gray-200">
                        <span className="font-medium">{k}:</span>{' '}
                        {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                      </div>
                    ))}
                  </div>
                )
              }
              return String(value)
            }
            return (
              <tr key={key}>
                <td className="p-2 border font-medium">{key}</td>
                <td className="p-2 border font-mono text-sm">
                  {formatVendorValue()}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
