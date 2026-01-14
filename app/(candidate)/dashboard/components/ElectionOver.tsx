import PrimaryButton from '@shared/buttons/PrimaryButton'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import ScheduleModal from 'app/(candidate)/onboarding/shared/ScheduleModal'

import Image from 'next/image'

const ElectionOver = (): React.JSX.Element => {
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
        Contact us for a debrief about how the election went.
      </Body1>
      <ScheduleModal
        calendar="https://meetings.hubspot.com/kennedy-mason/candidate-debrief-interviews"
        btn={<PrimaryButton>Contact us for a debrief</PrimaryButton>}
      />
    </section>
  )
}

export default ElectionOver
