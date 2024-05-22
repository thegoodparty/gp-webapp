import { LeadingActivityCards } from 'app/(company)/team/components/LeadingActivityCards';

const LeadingTheMovement = () => (
  <section className="px-4 py-8 lg:p-24">
    <h2 className="text-4xl md:text-6xl leading-tight mb-8 font-medium">
      <span>Leading the </span>
      <br className="md:hidden" />
      <span className="text-tertiary">movement</span>
    </h2>
    <LeadingActivityCards />
  </section>
);

export default LeadingTheMovement;
