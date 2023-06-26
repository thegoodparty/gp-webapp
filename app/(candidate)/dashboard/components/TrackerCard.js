import SecondaryButton from '@shared/buttons/SecondaryButton';
import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import H4 from '@shared/typography/H4';
import ProgressPie from './ProgressPie';

export default function TrackerCard(props) {
  const { card } = props;
  const { key, title, progress, total, icon } = card;
  return (
    <div className="bg-gray-50 py-6 px-7 border border-slate-300 rounded-2xl">
      <div className="flex items-center mb-5">
        <div className="text-indigo-50 mr-2">{icon}</div>
        <H4>{title}</H4>
      </div>
      <ProgressPie total={total} progress={progress} />
      <div className="mt-7">
        <SecondaryButton fullWidth>Add</SecondaryButton>
      </div>
    </div>
  );
}
