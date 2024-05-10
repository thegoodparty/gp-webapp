export const impactStats = [
  {
    stat: '25%',
    description: 'Win rate in 2023',
  },
  {
    stat: '500+',
    description: 'Candidates supported',
  },
  {
    stat: '1,100+',
    description: 'Volunteers nationwide',
  },
];

export const ImpactStats = () => (
  <div className="grid grid-cols-3 gap-0 text-right">
    {impactStats.map(({ stat, description }, key) => (
      <div
        key={key}
        className="border-r-4 border-secondary pr-4 mb-8 last:mb-0 col-span-3 lg:col-span-1 lg:mb-0"
      >
        <h2 className="text-5xl mb-1 leading-tight">{stat}</h2>
        <h4 className="text-xl leading-7">{description}</h4>
      </div>
    ))}
  </div>
);

export default ImpactStats;
