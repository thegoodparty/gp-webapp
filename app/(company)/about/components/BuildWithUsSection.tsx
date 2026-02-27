import { BuildWithUsGridItems } from './BuildWithUsGridItems'

const BuildWithUsHeaderAndBlurb = (): React.JSX.Element => (
  <div className="xl:col-span-2">
    <h2 className="text-4xl mb-4 md:text-5xl leading-tight font-medium md:text-6xl leading-snug">
      Build a better <br className="hidden md:inline" />
      democracy <br className="md:hidden" />
      <span className="text-tertiary-main">with us</span>
    </h2>
    <p className="text-xl font-medium leading-7 mb-8 md:max-w-[466px] md:text-2xl leading-8">
      Ready to join the movement? Support candidates, run for office or join our
      community of like-minded individuals.
    </p>
  </div>
)

const BuildWithUsSection = (): React.JSX.Element => (
  <section
    className="relative
  px-4
  pt-8
  mb-16
  md:pt-24
  md:px-24
  md:mb-24
  xl:px-0
  xl:pt-24
  xl:mx-auto"
  >
    <div className="max-w-screen-xl mx-auto">
      <div className="hidden xl:grid grid-cols-4 gap-4">
        <BuildWithUsHeaderAndBlurb />
        <BuildWithUsGridItems />
      </div>
      <div className="xl:hidden">
        <BuildWithUsHeaderAndBlurb />
        <div className="grid col-span-12 md:grid-cols-3 md:gap-4">
          <BuildWithUsGridItems />
        </div>
      </div>
    </div>
  </section>
)

export default BuildWithUsSection
