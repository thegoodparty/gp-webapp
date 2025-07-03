import H1 from '@shared/typography/H1'
import ShareButtons from '../../components/ShareButtons'
import Body2 from '@shared/typography/Body2'
import H3 from '@shared/typography/H3'
import { LuPartyPopper } from 'react-icons/lu'

export default function CompleteStep({ vanityPath }) {
  const url = `goodparty.org/c/${vanityPath}`
  return (
    <>
      <div className="mb-2 rounded-full bg-gradient-to-br from-[#E0FFE0] to-[#FFF6E0] w-12 h-12 flex items-center justify-center">
        <LuPartyPopper size={24} />
      </div>
      <H1 className="mb-2">Congratulations, your website is live!</H1>
      <Body2 className="text-gray-500">{url}</Body2>
      <div className="my-6 h-[1px] bg-black/[0.12]"></div>
      <H3 className="mb-2">Share with supporters</H3>
      <Body2 className="mb-6">
        Tell your friends, family and supporters about your new campaign
        website.
      </Body2>
      <ShareButtons url={url} />
    </>
  )
}
