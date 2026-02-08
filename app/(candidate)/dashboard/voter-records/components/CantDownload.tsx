import PrimaryButton from '@shared/buttons/PrimaryButton'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import H1 from '@shared/typography/H1'
import { RiFolderForbidLine } from 'react-icons/ri'
import TrackCantDownload from './TrackCantDownload'

interface Campaign {
  slug?: string
}

interface CantDownloadProps {
  campaign: Campaign | null
}

export default function CantDownload(props: CantDownloadProps): React.JSX.Element {
  return (
    <div className="py-20 w-full">
      <div className="max-w-screen-md mx-auto">
        <div className="p-6 md:p-16 rounded-2xl border border-indigo-200 bg-secondary-background">
          <div className="text-center ">
            <div className="flex justify-center text-gray-800 mb-8">
              <RiFolderForbidLine size={80} />
            </div>
            <H1 className="mb-2">
              We were not able to process your voter file automatically.
            </H1>
            <Body1 className="mb-8">
              This is usually due to a manual office selection.
            </Body1>
            <Body2 className="mb-4">
              Please contact us to generate your voter file.
            </Body2>
            <a
              href="mailto:politics@goodparty.org"
              rel="noopener noreferrer nofollow"
            >
              <PrimaryButton>Contact us</PrimaryButton>
            </a>
          </div>
        </div>
      </div>
      <TrackCantDownload {...props} />
    </div>
  )
}
