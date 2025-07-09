import H1 from '@shared/typography/H1'
import ShareButtons from '../../components/ShareButtons'
import Body2 from '@shared/typography/Body2'
import H3 from '@shared/typography/H3'
import { LuPartyPopper } from 'react-icons/lu'
import Button from '@shared/buttons/Button'

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE || 'https://goodparty.org'

export default function CompleteStep({ vanityPath }) {
  const url = `${BASE_URL}/c/${vanityPath}`
  return (
    <div className="block lg:grid lg:grid-cols-2 items-center gap-12">
      <div className="lg:flex lg:flex-col lg:items-center lg:text-center">
        <div className="mb-2 rounded-full bg-gradient-to-br from-[#E0FFE0] to-[#FFF6E0] w-12 h-12 lg:w-20 lg:h-20 flex items-center justify-center">
          <LuPartyPopper className="text-2xl lg:text-5xl" />
        </div>
        <H1 className="mb-2 lg:text-5xl">
          Congratulations, your website is live!
        </H1>
        <Body2 className="text-gray-500">{url}</Body2>
        <div className="my-6 h-[1px] bg-black/[0.12]"></div>
      </div>

      <div className="lg:text-center lg:p-16 lg:bg-white lg:rounded-lg lg:border lg:border-black/[0.12]">
        <H3 className="mb-2">Share with supporters</H3>
        <Body2 className="mb-6">
          Tell your friends, family and supporters about your new campaign
          website.
        </Body2>
        <ShareButtons url={url} />
      </div>
      <div className="col-span-2 flex mt-8 justify-end lg:justify-center">
        <Button
          size="large"
          href="/dashboard/website"
          className="!px-12 fixed bottom-4 lg:static"
        >
          Finish
        </Button>
      </div>
    </div>
  )
}
