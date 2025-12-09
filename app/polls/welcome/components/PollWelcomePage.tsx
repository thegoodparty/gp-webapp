import { LuUsersRound } from 'react-icons/lu'
import { LuMessagesSquare } from 'react-icons/lu'
import { LuFileChartColumnIncreasing } from 'react-icons/lu'

import GetStartedButton from './GetStartedButton'

export default function PollWelcomePage() {
  return (
    <div className="pt-12">
      <section className="max-w-screen-md mx-auto p-4 sm:p-8 lg:p-16 h-full md:h-auto bg-white md:border md:border-slate-200 md:rounded-xl ">
        <div className="flex flex-col items-center md:justify-center sm:h-screen md:h-auto  xs:mt-4">
          <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl">
            Represent your community like a Civic Hero.
          </h1>
          <div className="grid grid-cols-1 gap-4 mt-12 w-full">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
              <div className="text-2xl bg-purple-100 rounded-full p-4">
                <LuUsersRound />
              </div>
              <p className="font-normal text-base md:text-lg">
                Meet your constituents and see what issues matter to them.
              </p>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
              <div className="text-2xl bg-yellow-100 rounded-full p-4">
                <LuMessagesSquare />
              </div>
              <p className="font-normal text-base md:text-lg">
                Use polling to prioritize issues and remove bias.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-2xl bg-green-100 rounded-full p-4 items-center justify-center">
                <LuFileChartColumnIncreasing />
              </div>
              <p className="font-normal text-base md:text-lg">
                Report your progress with our fully compliant solution.
              </p>
            </div>
          </div>
          <GetStartedButton />
        </div>
      </section>
    </div>
  )
}

