import ImpactStats from 'app/(company)/team/components/ImpactStats'
import MaxWidth from '@shared/layouts/MaxWidth'

const OurImpact = () => (
  <section className="bg-primary-main px-4 py-8 font-medium text-primary-contrast lg:p-24">
    <MaxWidth>
      <div className="grid grid-cols-3">
        <h2
          className="
          col-span-3
          text-4xl
          leading-tight
          mb-8
          lg:col-span-1
          lg:text-5xl
          lg:mb-16"
        >
          Our impact
        </h2>
        <div className="col-span-3 lg:col-span-2">
          <ImpactStats />
        </div>
      </div>
    </MaxWidth>
  </section>
)

export default OurImpact
