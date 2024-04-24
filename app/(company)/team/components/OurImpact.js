import ImpactStats from 'app/(company)/team/components/ImpactStats';

const OurImpact = () => (
  <section className="bg-primary-main px-4 py-8 font-medium text-primary-contrast">
    <h2 className="text-4xl leading-tight mb-8">Our impact</h2>
    <div className="text-right">
      <ImpactStats />
    </div>
  </section>
);

export default OurImpact;
