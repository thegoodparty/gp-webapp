import MaxWidth from '@shared/layouts/MaxWidth'
import Image from 'next/image'
import img from 'public/images/landing-pages/change.png'

import Body1 from '@shared/typography/Body1'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import ScheduleModal from 'app/(candidate)/onboarding/shared/ScheduleModal'

export default function VolunteerSection(): React.JSX.Element {
  return (
    <section className="bg-secondary-light pt-12 text-primary">
      <MaxWidth>
        <h2 className="text-center font-semibold text-6xl">
          Volunteer and help indie<div className="hidden lg:block"></div>{' '}
          candidates WIN!
        </h2>
        <div className="grid grid-cols-12 gap-8 items-center mt-20">
          <div className="col-span-12 md:col-span-6">
            <h3 className="font-semibold  text-2xl mb-4">
              Use your skills for good
            </h3>
            <Body1>
              Helping independent campaigns win will take all of us. Schedule an
              info session to learn how you can put your skills to work for
              inspiring leaders that reject the duopoly.
            </Body1>
            <div className="mt-8">
              <ScheduleModal
                btn={
                  <PrimaryButton id="ads23-schedule">
                    Schedule info session
                  </PrimaryButton>
                }
                calendar="https://meetings.hubspot.com/robbooth/gp-info-session"
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Image
              alt="We need change"
              src={img}
              className="w-full object-contain"
            />
          </div>
        </div>
      </MaxWidth>
      <div className="bg-[linear-gradient(176deg,_rgba(0,0,0,0)_54.5%,_#0D1528_55%)] h-[calc(100vw*0.09)] w-full" />
    </section>
  )
}
