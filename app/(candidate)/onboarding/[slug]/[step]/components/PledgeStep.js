'use client'
import { useState } from 'react'
import {
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions'
import H1 from '@shared/typography/H1'
import H4 from '@shared/typography/H4'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import { MdPerson, MdGroups, MdFlag } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import {
  EVENTS,
  trackEvent,
} from 'helpers/analyticsHelper'
import Button from '@shared/buttons/Button'

export default function PledgeStep({ campaign, step }) {
  const [pledged, setPledged] = useState(campaign?.details?.pledged || false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    trackEvent(EVENTS.Onboarding.PledgeStep.ClickSubmit)
    if (loading) {
      return
    }
    setLoading(true)
    setPledged(true)
    const currentStep = onboardingStep(campaign, step)
    const attr = [
      { key: 'data.currentStep', value: currentStep },
      { key: 'details.pledged', value: true },
    ]

    await updateCampaign(attr)
    router.push(`/onboarding/${campaign.slug}/${step + 1}`)
  }

  return (
    <div>
      <H1 className="py-10 text-center">User Agreement</H1>
      
      <div className="px-6 pb-10">
        <div className="space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <MdPerson className="mr-2" size={24} />
              <H4>Independent</H4>
            </div>
            <Body1>I am on the ballot as a nonpartisan, independent, or third-party candidate. I don&apos;t serve on any boards or organizations affiliated with the Democratic or Republican parties. I am committed to serving the interests of the people regardless of partisan politics.</Body1>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <MdGroups className="mr-2" size={24} />
              <H4>People-Powered</H4>
            </div>
            <Body1>I will focus on solving the problems facing my community, not serving myself or special interests. I will disclose donors and ensure that most of my funding comes from individual donors, not from corporations, unions or other special interests.</Body1>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <MdFlag className="mr-2" size={24} />
              <H4>Anti-Corruption</H4>
            </div>
            <Body1>I will uphold the highest level of integrity by being open, transparent and accountable about my positions and progress on issues. This means staying connected to, informed by, and responsive to all my constituents using modern tools and data to inform decisions.</Body1>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => {
              handleSave()
            }}
            size="large"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'I Agree'}
          </Button>
        </div>

        <div className="flex justify-center text-center mt-4">
        <Body2 className="text-gray-600">By continuing, you agree to run a civil campaign focused on listening to citizens, learning about important issues and demonstrating your ability to serve, not mudslinging with your opponents, and accept GoodParty.org’s       <a
        className="underline cursor-pointer"
        href="/terms-of-service"
        target="_blank"
      >
        Terms of Service
      </a> and <a className="underline" href="/privacy" target="_blank">
        Privacy Policy
      </a>.</Body2>
      </div>
      </div>


    </div>
  )
}
