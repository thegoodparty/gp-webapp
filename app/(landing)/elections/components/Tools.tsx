import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'
import Image from 'next/image'
import dashboardImg from 'public/images/elections/dashboard.png'
import helpImg from 'public/images/elections/help.png'

interface ToolsProps {
  negativeMargin?: boolean
}

const Tools = ({ negativeMargin = true }: ToolsProps): React.JSX.Element => {
  return (
    <section>
      <div className="max-w-screen-xl mx-auto">
        <div
          className={`bg-indigo-200 md:rounded-3xl p-12 ${
            negativeMargin ? 'md:-mt-[100px] lg:-mt-[150px]' : ''
          } `}
        >
          <Image
            src="/images/black-logo.svg"
            width={350}
            height={40}
            alt="GoodParty.org"
          />
          <div className="grid grid-cols-12 gap-4 md:gap-8  mt-10">
            <div className="col-span-12 md:col-span-6">
              <h2 className="text-3xl md:text-5xl font-bold leading-relaxed">
                Free tools for independent candidates
              </h2>
              <Body1 className="mt-8 mb-8 md:mb-14 leading-relaxed">
                Get free AI-powered tools to accelerate your campaign strategy.
                GoodParty.org&apos;s AI Campaign Manager lets you track your
                progress toward key voter outreach goals, instantly generate
                custom campaign materials, and get access to a nationwide
                network of grassroots volunteers. Get a free demo today to see
                how the AI Campaign Manager can streamline your campaign
                strategy.
              </Body1>
              <Button
                href="/get-a-demo"
                id="get-a-demo"
                size="large"
                color="secondary"
              >
                Get a free demo
              </Button>
            </div>
            <div className="col-span-12 md:col-span-6">
              <Image
                src={dashboardImg}
                alt="Dashboard"
                className="mt-12 md:mt-0"
              />
            </div>
            <div className="col-span-12 md:col-span-6 hidden md:flex  justify-end">
              <div className="w-2/3 ">
                <Image
                  src={helpImg}
                  alt="GoodParty.org AI can help you"
                  className="mt-12 md:mt-0"
                />
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 mt-14">
              <h3 className="text-2xl md:text-3xl font-medium">
                GoodParty.org AI can help you
              </h3>
              <Body1 className="mt-8 mb-8 md:mb-14 leading-relaxed text-xl">
                <ul>
                  <li className="mb-3">Generate engaging content in seconds</li>
                  <li className="mb-3">
                    Refine your campaign strategy with voter data
                  </li>
                  <li className="mb-3">
                    Recruit volunteers and fill key campaign roles
                  </li>
                </ul>
              </Body1>
            </div>
          </div>
          <div className="mt-8 md:mt-14 text-center">
            <h3 className="text-3xl md:text-5xl font-medium mb-10">
              Try the AI campaign manager today
            </h3>
            <Button
              href="/run-for-office"
              aria-label="Try the AI campaign manager today"
              id="run-for-office-get-started"
              size="large"
              color="secondary"
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Tools
