
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

export const ImpactStats = () => impactStats.map(
  ({ stat, description }, key) => <div
    key={key}
    className="border-r-4 border-secondary pr-4 mb-8 last:mb-0">
    <h2 className="text-5xl mb-1 leading-tight">{stat}</h2>
    <h4 className="text-xl leading-7">{description}</h4>
  </div>
);

export default ImpactStats;
