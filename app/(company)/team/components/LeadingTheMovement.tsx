import { LeadingActivityCards } from 'app/(company)/team/components/LeadingActivityCards'

const LeadingTheMovement = (): React.JSX.Element => (
  <section className="py-8 lg:py-24">
    <h2 className="text-4xl leading-tight md:text-6xl md:leading-none mb-8 font-medium">
      <span>Leading the </span>
      <br className="md:hidden" />
      <span className="text-tertiary">movement</span>
    </h2>
    <LeadingActivityCards />
  </section>
)

export default LeadingTheMovement
