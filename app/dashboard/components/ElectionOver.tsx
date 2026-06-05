'use client'
import { Button } from '@styleguide'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import ScheduleModal from 'app/onboarding/shared/ScheduleModal'
import { useCampaign } from '@shared/hooks/useCampaign'

import Image from 'next/image'

const ElectionOver = (): React.JSX.Element => {
  const [campaign] = useCampaign()
  const isPro = campaign?.isPro || false

  return (
    <section className="py-10 flex items-center flex-col">
      <H1 className="mb-4">This race has concluded!</H1>
      <Image
        src="/images/dashboard/race-flag.svg"
        width={172}
        height={172}
        alt="election over"
      />
      <Body1 className="my-5">
        {isPro
          ? 'Contact us for a debrief about how the election went.'
          : "You ran a great race, sorry you didn't come out on top"}
      </Body1>
      {isPro && (
        <ScheduleModal
          calendar="https://join.goodparty.org/meetings/campaign-success/election-debrief"
          btn={<Button>Contact us for a debrief</Button>}
        />
      )}
    </section>
  )
}

export default ElectionOver
