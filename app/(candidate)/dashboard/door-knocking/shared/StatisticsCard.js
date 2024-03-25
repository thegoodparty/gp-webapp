import Body2 from '@shared/typography/Body2';

export default function StatisticsCard({ value, label }) {
  return (
    <div className="bg-gray-50 border border-slate-300 rounded-xl p-4">
      <h3 className="mb-2  text-center text-4xl xl:text-5xl font-medium">
        {value}
      </h3>
      <Body2 className="text-center">{label}</Body2>
    </div>
  );
}
