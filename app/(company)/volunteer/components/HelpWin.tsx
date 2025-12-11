import MaxWidth from '@shared/layouts/MaxWidth'
import Image from 'next/image'
import winImg from 'public/images/landing-pages/win.png'
import Button from '@shared/buttons/Button'

export default function HelpWin(): React.JSX.Element {
  return (
    <>
      <div className="bg-[linear-gradient(176deg,_#F9FAFB_54.5%,_#F1FBA3_55%)] h-[calc(100vw*0.09)] w-full" />
      <section className="bg-secondary-light py-12">
        <MaxWidth>
          <h2 className="lg:w-1/2 lg:mx-auto text-3xl md:text-6xl font-semibold text-center mb-20">
            Volunteer and help indie candidates WIN!
          </h2>
          <div className="grid grid-cols-12 gap-8">
            <div className=" col-span-12 md:col-span-6">
              <h3 className=" text-2xl font-semibold">
                Use your skills for good
              </h3>
              <div className=" font-sfpro text-lg my-4">
                Stay up to date on the latest volunteer news and opportunities
                via text.
              </div>

              <Button
                href="https://goodpartyorg.circle.so/join?invitation_token=972b834345e05305e97fcc639c51ac54e3a04d8b-1c106100-4719-4b8a-81e1-73e513bbcd5f"
                id="schedule-info-session"
                size="large"
                className="w-full md:w-auto"
              >
                Join the Community
              </Button>
            </div>
            <div className=" col-span-12 md:col-span-6 hidden md:block">
              <div className="mx-12 xl:mx-20">
                <Image src={winImg} alt="Win" />
              </div>
            </div>
          </div>
        </MaxWidth>
      </section>
    </>
  )
}
