import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import { PiHandHeart } from 'react-icons/pi'
import GetStartedButton from './GetStartedButton'

export default function ServePage({ pathname }) {
  return (
    <section className="max-w-screen-md mx-auto p-4 md:p8">
      <div className="flex flex-col items-center justify-center h-screen">
        <H1 className="text-center">
          Represent your community like a Civic Hero.
        </H1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-12 ">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-200 lg:border-b-0 lg:mb-0">
            <div className="text-2xl bg-purple-100 rounded-full p-4">
              <PiHandHeart />
            </div>
            <Body1>
              Meet your constituents and see what issues matter to them.
            </Body1>
          </div>
          <div className="flex items-center gap-4 pb-4 border-b border-slate-200 lg:border-b-0 lg:mb-0">
            <div className="text-2xl bg-purple-100 rounded-full p-4">
              <PiHandHeart />
            </div>
            <Body1>
              Meet your constituents and see what issues matter to them.
            </Body1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl bg-purple-100 rounded-full p-4">
              <PiHandHeart />
            </div>
            <Body1>
              Meet your constituents and see what issues matter to them.
            </Body1>
          </div>
        </div>
        <GetStartedButton />
      </div>
    </section>
  )
}
