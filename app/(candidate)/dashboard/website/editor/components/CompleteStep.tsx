import Button from '@shared/buttons/Button'
import HighFiveAnimation from '@shared/animations/HighFiveAnimation'
import ShareModal from '../../components/ShareModal'
import { useState } from 'react'
import Body2 from '@shared/typography/Body2'
import { FaCheck } from 'react-icons/fa'
import Body1 from '@shared/typography/Body1'
import MarketingH4 from '@shared/typography/MarketingH4'
import Image from 'next/image'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { getWebsiteUrl } from '../../util/website.util'
import { Domain } from 'helpers/types'

interface CompleteStepProps {
  vanityPath: string
  domain?: Domain | null
}

const CompleteStep = ({
  vanityPath,
  domain,
}: CompleteStepProps): React.JSX.Element => {
  const suggestedUrl = `${vanityPath}.com`
  const url = getWebsiteUrl(vanityPath, false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  return (
    <div className="text-center flex flex-col items-center gap-4">
      <div className="relative h-24 w-24 cursor-pointer">
        <HighFiveAnimation hover />
      </div>
      <h3 className="text-3xl font-medium md:text-4xl lg:text-5xl leading-tight">
        Congratulations,
        <br />
        your website is live!
      </h3>

      <Button onClick={() => setShareModalOpen(true)} color="neutral">
        Share
      </Button>
      {!domain ? (
        <div className=" bg-[#F1E5FF] rounded-lg p-4 md:p-12 w-full relative">
          <div className="absolute top-0 left-0">
            <Image
              src="/images/website/purple-shape.png"
              width={300}
              height={400}
              alt=""
            />
          </div>

          <div className="flex flex-col  gap-4 w-full  justify-evenly md:flex-row-reverse relative">
            <div className="text-left md:w-1/2">
              <MarketingH4>Unlock digital outreach with a domain</MarketingH4>
              <Body2 className="text-gray-500 mt-2">({suggestedUrl})</Body2>
              <div className="mt-12">
                <div className="flex items-center gap-2 mb-4">
                  <FaCheck />
                  <Body1>Get 5,000 texts</Body1>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <FaCheck />
                  <Body1>Target the right voters</Body1>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheck />
                  <Body1>Make your campaign compliant</Body1>
                </div>
              </div>
              <Button
                href="/dashboard/website/domain"
                className="mt-12"
                onClick={() =>
                  trackEvent(EVENTS.CandidateWebsite.StartedDomainSelection)
                }
              >
                Add a domain
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center items-center">
              <Image
                src="/images/website/texting.png"
                alt="texting"
                width={265}
                height={330}
                priority
              />
            </div>
          </div>
        </div>
      ) : (
        <Button href="/dashboard/website" className="mt-12">
          Back to website metrics
        </Button>
      )}
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={url}
      />
    </div>
  )
}

export default CompleteStep
