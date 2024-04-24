import { LeadingActivityCards } from 'app/(company)/team/components/LeadingActivityCards';

const LeadingTheMovement = () => (
  <section className="px-4 py-8">
    <h2 className="text-4xl leading-tight mb-8 font-medium">
      Leading the
      <br className="md:hidden" />
      <span className="text-tertiary">movement</span>
    </h2>
    <LeadingActivityCards />
  </section>
);

export default LeadingTheMovement;
