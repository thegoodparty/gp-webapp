import { OpenInNewRounded } from '@mui/icons-material'
import Button from '@shared/buttons/Button'
import WebsiteContent from './WebsiteContent'
import Paper from '@shared/utils/Paper'

export default function WebsitePreview({ website, campaign }) {
  console.log('website preview', website)
  return (
    <Paper className="!p-0 flex-grow h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="text-center text-sm text-gray-500">Preview</div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            href={`/c/${website.vanityPath}`}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <OpenInNewRounded className="h-4 w-4" />
            Preview Website
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {campaign && website && (
          <WebsiteContent website={website} campaign={campaign} />
        )}
      </div>
    </Paper>
  )
}
